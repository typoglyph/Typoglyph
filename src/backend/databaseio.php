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
		static::$logger->debug("Executing statement on '{$this->connectionString}': {$statement->queryString}");
		$statement->execute();
		$puzzles = $statement->fetchAll(PDO::FETCH_OBJ);
		return PuzzleDecoder::decodePuzzles($puzzles);
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
			LIMIT ?;');
		$statement->bindParam(1, $count, PDO::PARAM_INT);
		static::$logger->debug("Executing statement on '{$this->connectionString}': {$statement->queryString}");
		$statement->execute();
		$puzzles = $statement->fetchAll(PDO::FETCH_OBJ);
		return PuzzleDecoder::decodePuzzles($puzzles);
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
			$statement->bindParam(":id", $puzzle->id);
			$statement->bindParam(":sentence", PuzzleEncoder::encodePuzzleSentence($puzzle));
			$statement->bindParam(":options", PuzzleEncoder::encodePuzzleOptions($puzzle));
			static::$logger->debug("Executing statement on '{$this->connectionString}': {$statement->queryString}");
			$statement->execute();
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
			$statement->bindParam(":sentence", PuzzleEncoder::encodePuzzleSentence($puzzle));
			$statement->bindParam(":options", PuzzleEncoder::encodePuzzleOptions($puzzle));
			static::$logger->debug("Executing statement on '{$this->connectionString}': {$statement->queryString}");
			$statement->execute();
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
			$statement->bindParam(":id", $puzzleId);
			static::$logger->debug("Executing statement on '{$this->connectionString}': {$statement->queryString}");
			$statement->execute();
		}
	}
}
DatabaseWrapper::staticInit();


/**
 * Translates from a puzzle object into database format
 */
class PuzzleEncoder {
	/**
	 * @param Puzzle $puzzle
	 * @return string The puzzle's sentence as stored in the database
	 */
	static function encodePuzzleSentence($puzzle) {		
		$encodedSentence = "";
		for ($i = 0; $i <= strlen($puzzle->sentence); $i++) {
			$gap = static::getGapAtPosition($puzzle, $i);
			if ($gap !== Null) {
				$encodedSentence .= "{";
				$option = $gap->solution;
				if ($option !== Null) {
					for ($j = 0; $j < strlen($option->value); $j++) {
						$encodedSentence .= static::escapeSentenceChar($option->value[$j]);
					}
				}
				$encodedSentence .= "}";
			}
			
			if ($i < strlen($puzzle->sentence)) {
				$char = $puzzle->sentence[$i];
				$encodedSentence .= static::escapeSentenceChar($char);
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
			$optionValue = $option->value;
			if (strlen($optionValue) !== 1)
				throw new Exception("Unexpected option value: " . $optionValue);
			
			$encodedOptions .= $optionValue;
		}
		return $encodedOptions;
	}
	
	
	private static function getGapAtPosition($puzzle, $position) {
		foreach ($puzzle->gaps as $gap) {
			if ($gap->position === $position) {
				return $gap;
			}
		}
		return Null;
	}
	
	private static function escapeSentenceChar($char) {
		if ($char === "{")
			return "\\{";
		if ($char === "}")
			return "\\}";
		if ($char === "\\")
			return "\\\\";
		return $char;
	}
	
	
	private function __construct() {
		throw new Exception("Use the static methods instead");
	}
}


/**
 * Translates from database format into a puzzle object
 */
class PuzzleDecoder {	
	/**
	 * @param Array<object> $dbPuzzles The puzzles as stored in the database
	 * @return Array<Puzzle> The puzzles as represented by the Puzzle class
	 */
	static function decodePuzzles($dbPuzzles) {
		$results = array();
		foreach ($dbPuzzles as $dbPuzzle) {
			$result = static::decodePuzzle($dbPuzzle);
			array_push($results, $result);
		}
		return $results;
	}
	
	/**
	 * @param object $dbPuzzle The puzzle as stored in the database
	 * @return Puzzle The puzzle as represented by the Puzzle class
	 */
	static function decodePuzzle($dbPuzzle) {
		$puzzle = new Puzzle();
		$puzzle->id = $dbPuzzle->_id;
		
		// Sort out the options
		// For each character
		foreach (str_split($dbPuzzle->options) as $dbOption) {
			// str_split returns an array containing only "" when given "" as parameter
			if (strlen($dbOption) === 0)
				continue;
			
			$option = new Option();
			$option->value = $dbOption;
			array_push($puzzle->options, $option);
		}
		
		// Sort out the sentence and the gaps
		// For each character
		$escaped = False;
		$gap = Null;
		$specialChars = 0;
		foreach (str_split($dbPuzzle->sentence) as $i=>$char) {
			// str_split returns an array containing only "" when given "" as parameter
			if (strlen($char) === 0)
				continue;
			
			// Set the flag so that the next character is properly escaped
			if (!$escaped && $char === "\\") {
				$escaped = True;
				$specialChars++;
				
			} elseif (!$escaped && $char === "{") {
				if ($gap !== Null) {
					// The input was something like "Hello {{} world" instead of "Hello {\{} world"
					throw new Exception("Char<$i>: Non-escaped '{' found before the current '{' was closed: '{$dbPuzzle->sentence}'");
				}
				// We have hit the start of a gap - create an object to represent it
				$gap = new Gap();
				$gap->position = ($i - $specialChars);
				$specialChars++;
				
			} elseif (!$escaped && $char === "}") {
				if ($gap === Null) {
					// The input was something like "Hello {}} world" instead of "Hello {\}} world", or maybe "Hello } world" instead of "Hello \} world"
					throw new Exception("Char<$i>: Non-escaped '}' found before any '{' was opened: '{$dbPuzzle->sentence}'");
				}
				$specialChars++;
				
				// We have reached the end of a gap - add it to the puzzle and clear our reference of it
				array_push($puzzle->gaps, $gap);
				$gap = Null;
				
			} else {
				// It's just a normal, bogstandard character (or has been escaped, so we must treat it like one)
				if ($gap === Null) {
					// We are not inside a gap - just add the character to the end of the sentence!
					$puzzle->sentence .= $char;
				} else {
					// We are inside a gap and this character is part of the solution
					if ($gap->solution === Null) {
						$gap->solution = new Option();
						$gap->solution->value = "";
						$specialChars++;
					}
					$gap->solution->value .= $char;
				}
				
				// If this character was escaped, clear the flag so the next character is treated normally
				$escaped = False;
			}
		}
		return $puzzle;
	}
	
	
	private function __construct() {
		throw new Exception("Use the static methods instead");
	}
}
?>
