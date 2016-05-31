<?php
require_once("puzzle/PuzzleEncoder.php");


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
?>
