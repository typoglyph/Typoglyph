<?php
require_once("logger.php");
require_once("puzzle.php");


/**
 * 
 */
class DatabaseWrapper {
	private static $logger;
	private $connectionString;
	private $connection;
	
	static function staticInit() {
		static::$logger = LoggerFactory::getLogger(__CLASS__);
	}
	
	/**
	 * @param string $connectionString
	 * @param string $username
	 * @param string $password
	 */
	function __construct($connectionString, $username, $password) {
		static::$logger->info("Connecting to database: '$connectionString'");
		$this->connectionString = $connectionString;
		$this->connection = new PDO($connectionString, $username, $password);
		$this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	
	
	/**
	 * @return Array<Puzzle> An array containing all of the puzzles currently stored in the
	 *     database
	 */
	function fetchAllPuzzles() {
		$statement = $this->connection->prepare('
			SELECT *
			FROM `puzzles`;');
		$this->logPreparedStatement($statement, array());
		$statement->execute();
		$puzzles = $statement->fetchAll(PDO::FETCH_OBJ);
		return DbPuzzleDecoder::decodePuzzles($puzzles);
	}
	
	/**
	 * @param int $count How many puzzles to return
	 * @return Array<Puzzle> An array containing a random selection of $count puzzles currently
	 *     stored in the database, ordered randomly. If less than $count puzzles are available,
	 *     less than $count puzzles will be returned.
	 */
	function fetchRandomPuzzles($count) {
		$statement = $this->connection->prepare('
			SELECT *
			FROM `puzzles`
			ORDER BY RAND()
			LIMIT :limit;');
		$statement->bindParam(":limit", $count, PDO::PARAM_INT);
		$this->logPreparedStatement($statement, array(":limit" => $count));
		$statement->execute();
		$puzzles = $statement->fetchAll(PDO::FETCH_OBJ);
		return DbPuzzleDecoder::decodePuzzles($puzzles);
	}
	
	/**
	 * @param Array<Puzzle> $puzzles The puzzles to update. Only puzzles with an ID matching a
	 *     database row will actually be updated.
	 */
	function updatePuzzles($puzzles) {
		$statement = $this->connection->prepare('
			UPDATE `puzzles`
			SET `sentence`=:sentence, `options`=:options
			WHERE `_id`=:id;');
		foreach ($puzzles as $puzzle) {
			$params = array(
				":id" => DbPuzzleEncoder::encodePuzzleId($puzzle),
				":sentence" => DbPuzzleEncoder::encodePuzzleSentence($puzzle),
				":options" => DbPuzzleEncoder::encodePuzzleOptions($puzzle)
			);
			$this->logPreparedStatement($statement, $params);
			$statement->execute($params);
		}
	}
	
	/**
	 * @param Array<Puzzle> $puzzles The puzzles to insert. Any specified IDs will be ignored.
	 */
	function insertPuzzles($puzzles) {
		$statement = $this->connection->prepare('
			INSERT INTO `puzzles` (`sentence`, `options`)
			VALUES (:sentence, :options)');
		foreach ($puzzles as $puzzle) {
			$params = array(
				":sentence" => DbPuzzleEncoder::encodePuzzleSentence($puzzle),
				":options" => DbPuzzleEncoder::encodePuzzleOptions($puzzle)
			);
			$this->logPreparedStatement($statement, $params);
			$statement->execute($params);
		}
	}
	
	/**
	 * @param Array<int> $puzzleIds The IDs of the puzzles to remove
	 */
	function removePuzzles($puzzleIds) {
		$statement = $this->connection->prepare('
			DELETE FROM `puzzles`
			WHERE `_id`=:id');
		foreach ($puzzleIds as $puzzleId) {
			$params = array( ":id" => $puzzleId );
			$this->logPreparedStatement($statement, $params);
			$statement->execute($params);
		}
	}
	
	
	private function logPreparedStatement($statement, $params) {
		$connStr = $this->connectionString;
		
		$statementStr = $statement->queryString;
		$statementStr = preg_replace("/\s+/", " ", $statementStr);
		$statementStr = trim($statementStr);
		
		$paramsStr = array();
		foreach ($params as $paramKey => $paramValue) {
			array_push($paramsStr, "$paramKey => $paramValue");
		}
		$paramsStr = implode(", ", $paramsStr);
		
		$logMsg = "Connection [$connStr] is executing prepared statement [$statementStr] using parameters [$paramsStr]";
		static::$logger->debug($logMsg);
	}
}
DatabaseWrapper::staticInit();


/**
 * Utilities to encode Puzzle objects into database format
 */
class DbPuzzleEncoder {
	/**
	 * @param Puzzle $puzzle
	 * @return int The puzzle's ID as stored in the database
	 */
	static function encodePuzzleId($puzzle) {
		return $puzzle->id;
	}
	
	/**
	 * @param Puzzle $puzzle
	 * @return string The puzzle's sentence as stored in the database
	 */
	static function encodePuzzleSentence($puzzle) {		
		$encodedSentence = "";
		foreach ($puzzle->sentenceFragments as $fragment) {
			if ($fragment instanceof Character) {
				$value = $fragment->value;
				$escaped = static::escapeForSentence($value);
				$encodedSentence .= $escaped;
				
			} else if ($fragment instanceof Gap) {
				$value = ($fragment->solution === null) ? "" : $fragment->solution->value;
				$escaped = static::escapeForSentence($value);
				$encodedSentence .= "{{$escaped}}";
				
			} else {
				throw new Exception("Unknown type of SentenceFragment: $fragment");
			}
		}
		return $encodedSentence;
	}
	
	/**
	 * @param Puzzle $puzzle
	 * @return string The puzzle's options as stored in the database
	 */
	static function encodePuzzleOptions($puzzle) {
		$encodedOptions = "";
		foreach ($puzzle->options as $option) {
			if ($strlen($option->value) !== 1) {
				throw new Exception("Unexpected option value: " . $option->value);
			}
			$encodedOptions .= $option->value;
		}
		return $encodedOptions;
	}
	
	private static function escapeForSentence($str) {
		$escaped = "";
		foreach ($str as $char) {
			switch ($char) {
				case "\\":
					$char = "\\\\";
					break;
				case "{":
					$char = "\\{";
					break;
				case "}":
					$char = "\\}";
					break;
			}
			$escaped .= $char;
		}
		return $escaped;
	}
	
	
	private function __construct() {
		throw new Exception("Use the static methods instead");
	}
}


/**
 * Utilities to decode from database format into Puzzle objects
 */
class DbPuzzleDecoder {
	/**
	 * @param Array<object> $puzzles The puzzles to decode, as stored in the database
	 * @return Array<Puzzle> The puzzles as represented by the Puzzle class
	 */
	static function decodePuzzles($puzzles) {
		$decodedPuzzles = array();
		foreach ($puzzles as $puzzle) {
			$decodedPuzzle = static::decodePuzzle($puzzle);
			array_push($decodedPuzzles, $decodedPuzzle);
		}
		return $decodedPuzzles;
	}
	
	/**
	 * @param object $puzzle The puzzle to decode, as stored in the database
	 * @return Puzzle The puzzle as represented by the Puzzle class
	 */
	static function decodePuzzle($puzzle) {
		$decodedId = $puzzle->_id;
		$decodedFragments = static::decodeSentence($puzzle->sentence);
		$decodedOptions = static::decodeOptions($puzzle->options);
		return new Puzzle($decodedId, $decodedFragments, $decodedOptions);
	}
	
	/**
	 * @param string $sentence The sentence to decode, as stored in the database
	 * @return Array<SentenceFragment>
	 */
	private static function decodeSentence($sentence) {	
		// True if the previous character was an escape character
		// True if the current character should be interpreted literally (ie. if it's a special char such as {, }, \)
		$nextCharIsEscaped = false;
		
		// If we are currently inside a set of unescaped {braces}, this represents the gap being parsed
		$openGap = null;
		
		$decodedFragments = array();
		
		for ($i = 0; $i < strlen($sentence); $i++) {
			$char = $sentence[$i];
			
			if ($char === "\\" && !$nextCharIsEscaped) {
				// Next char should be interpreted literally
				$nextCharIsEscaped = true;
				continue; // Must skip clearing the flag at the end of the loop
				
			} else if ($char === "{" && !$nextCharIsEscaped) {
				// A new gap has been opened
				if ($openGap !== null) {
					throw new Exception("Found an unescaped '$char' nested inside braces [index=$i]: $sentence");
				}
				$openGap = new Gap(null); // Keep solution null for now as the braces may be empty
				array_push($decodedFragments, $openGap);
				
			} else if ($char === "}" && !$nextCharIsEscaped) {
				// Current gap has been closed
				if ($openGap === null) {
					throw new Exception("Found an unescaped '$char' not nested inside braces [index=$i]: $sentence");
				}
				$openGap = null;
				
			} else {
				if ($openGap !== null) {
					// The char is inside the currently open gap
					if ($openGap->solution === null) {
						$openGap->solution = new Option("");
					}
					$openGap->solution->value .= $char;
					
				} else {
					$character = new Character($char);
					array_push($decodedFragments, $character);
				}
			}
			
			$nextCharIsEscaped = false;
		}
		
		return $decodedFragments;
	}
	
	/**
	 * @param string $options The options to decode, as stored in the database
	 * @return Array<Option>
	 */
	private static function decodeOptions($options) {
		$decodedOptions = array();
		for ($i = 0; $i < strlen($options); $i++) {
			$decodedOption = new Option($options[$i]);
			array_push($decodedOptions, $decodedOption);
		}
		return $decodedOptions;
	}
	
	
	private function __construct() {
		throw new Exception("Use the static methods instead");
	}
}
?>
