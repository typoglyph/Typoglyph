<?php
require_once("puzzle.php");


/**
 * 
 */
class DatabaseWrapper {
	private $connection;
	
	/**
	 * @param string $connectionString
	 * @param string $username
	 * @param string $password
	 */
	function __construct($connectionString, $username, $password) {
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
		$statement->execute();
		$puzzles = $statement->fetchAll(PDO::FETCH_OBJ);
		return $this->parsePuzzles($puzzles);
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
		$statement->execute();
		$puzzles = $statement->fetchAll(PDO::FETCH_OBJ);
		return $this->parsePuzzles($puzzles);
	}
	
	/**
	 * @param Array<object> $dbPuzzles The puzzles as stored in the database
	 * @return Array<Puzzle> The puzzles as represented by the Puzzle class
	 */
	private function parsePuzzles($dbPuzzles) {
		$results = array();
		foreach ($dbPuzzles as $dbPuzzle) {
			$result = $this->parsePuzzle($dbPuzzle);
			array_push($results, $result);
		}
		return $results;
	}
	
	/**
	 * @param object $dbPuzzle The puzzle as stored in the database
	 * @return Puzzle The puzzle as represented by the Puzzle class
	 */
	private function parsePuzzle($dbPuzzle) {
		$puzzle = new Puzzle();
		
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
		foreach (str_split($dbPuzzle->sentence) as $i=>$char) {
			// str_split returns an array containing only "" when given "" as parameter
			if (strlen($char) === 0)
				continue;
			
			// Set the flag so that the next character is properly escaped
			if (!$escaped && $char === "\\") {
				$escaped = True;
				
			} elseif (!$escaped && $char === "{") {
				if ($gap !== Null) {
					// The input was something like "Hello {{} world" instead of "Hello {\{} world"
					throw new Exception("Char<$i>: Non-escaped '{' found before the current '{' was closed: '{$dbPuzzle->sentence}'");
				}
				// We have hit the start of a gap - create an object to represent it
				$gap = new Gap();
				$gap->position = $i;
				
			} elseif (!$escaped && $char === "}") {
				if ($gap === Null) {
					// The input was something like "Hello {}} world" instead of "Hello {\}} world", or maybe "Hello } world" instead of "Hello \} world"
					throw new Exception("Char<$i>: Non-escaped '}' found before any '{' was opened: '{$dbPuzzle->sentence}'");
				}
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
					}
					$gap->solution->value .= $char;
				}
				
				// If this character was escaped, clear the flag so the next character is treated normally
				$escaped = False;
			}
		}
		return $puzzle;
	}
}
?>
