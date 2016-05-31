<?php
require_once("puzzle/Character.php");
require_once("puzzle/Gap.php");
require_once("puzzle/Option.php");
require_once("puzzle/Puzzle.php");


/**
 * Translation of PuzzleDecoder.js. Look there for documentation.
 * <p>
 * Utilities for parsing puzzles from various external formats such as JSON. All publicly-visible
 * methods should have a compatible counterpart in PuzzleEncoder.
 */
class PuzzleDecoder {
	/**
	 * @param string $json
	 * @return Puzzle
	 */
	static function fromJson($json) {
		$data = json_decode($json);
		return static::decodePuzzle($data);
	}
	
	/**
	 * @param string $json
	 * @return Array<Puzzle>
	 */
	static function fromJsonArray($json) {
		$dataArray = json_decode($json);
		$decodedPuzzles = array();
		foreach ($dataArray as $data) {
			$decodedPuzzle = static::decodePuzzle($data);
			array_push($decodedPuzzles, $decodedPuzzle);
		}
		return $decodedPuzzles;
	}
	
	/**
	 * @param object $data
	 * @return Puzzle
	 */
	private static function decodePuzzle($data) {
		if ($data === null) {
			return null;
		}
		
		$decodedId = $data->id;
		
		$decodedFragments = array();
		foreach ($data->sentenceFragments as $fragment) {
			$decodedFragment = static::decodeSentenceFragment($fragment);
			array_push($decodedFragments, $decodedFragment);
		}
		
		$decodedOptions = array();
		foreach($data->options as $option) {
			$decodedOption = static::decodeOption($option);
			array_push($decodedOptions, $decodedOption);
		}
		
		return new Puzzle($decodedId, $decodedFragments, $decodedOptions);
	}
	
	/**
	 * @param object $data
	 * @return SentenceFragment
	 */
	private static function decodeSentenceFragment($data) {
		if ($data === null) {
			return null;
			
		} else if (strtolower($data->type) === "character") {
			return new Character($data->value);
			
		} else if (strtolower($data->type) === "gap") {
			$decodedSolution = static::decodeOption($data->solution);
			return new Gap($decodedSolution);
			
		} else {
			throw new Exception("Unsupported SentenceFragment type: {$data->type}");
		}
	}

	/**
	 * @param object $data
	 * @return Option
	 */
	private static function decodeOption($data) {
		return ($data === null) ? null : new Option($data->value);
	}
	
	private function __construct() {
		throw new Exception("Use the static methods");
	}
}
?>
