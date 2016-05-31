<?php
require_once("puzzle/PuzzleDecoder.php");


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
