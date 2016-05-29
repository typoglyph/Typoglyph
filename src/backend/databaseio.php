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
			SELECT p.id, p.data
			FROM   puzzles p;');
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
			SELECT   p.id, p.data
			FROM     puzzles p
			ORDER BY RAND()
			LIMIT    :limit;');
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
			UPDATE puzzles p
			SET    p.data=:data
			WHERE  p.id=:id;');
		foreach ($puzzles as $puzzle) {
			$params = array(
				":id" => DbPuzzleEncoder::encodePuzzleId($puzzle),
				":data" => DbPuzzleEncoder::encodePuzzleData($puzzle)
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
			INSERT INTO puzzles (data)
			VALUES (:data)');
		foreach ($puzzles as $puzzle) {
			// Insert the puzzle with an empty "data" field
			$params = array(
				// Must be valid JSON in case we start using the JSON datatype from MySQL 5.7
				":data" => json_encode(Null)
			);
			$this->logPreparedStatement($statement, $params);
			$statement->execute($params);
			
			// Set the puzzle's ID to the ID of the row we just inserted
			$puzzle->id = (int) $this->connection->lastInsertId();
		}
		
		// Populate the newly-inserted puzzles with actual data
		$this->updatePuzzles($puzzles);
	}
	
	/**
	 * @param Array<int> $puzzleIds The IDs of the puzzles to remove
	 */
	function removePuzzles($puzzleIds) {
		$statement = $this->connection->prepare('
			DELETE FROM puzzles p
			WHERE       p.id=:id;');
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
	 * @return string The puzzle's data as stored in the database
	 */
	static function encodePuzzleData($puzzle) {
		return PuzzleEncoder::toJson($puzzle);
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
		$decodedPuzzle = PuzzleDecoder::fromJson($puzzle->data);
		if ((int) $puzzle->id !== $decodedPuzzle->id) {
			throw new Exception("puzzle.id [{$puzzle->id}] doesn't match puzzle.data.id [{$decodedPuzzle->id}]");
		}
		return $decodedPuzzle;
	}
	
	
	private function __construct() {
		throw new Exception("Use the static methods instead");
	}
}
?>
