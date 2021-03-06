<?php
require_once("puzzle/Character.php");
require_once("puzzle/Gap.php");


/**
 * Translation of PuzzleEncoder.js. Look there for documentation.
 * <p>
 * Utilities for converting puzzles into various external formats such as JSON. All publicly-visible
 * methods should have a compatible counterpart in PuzzleDecoder.
 */
class PuzzleEncoder {
	/**
	 * @param Puzzle $puzzle
	 * @param boolean [$pretty]
	 * @return string
	 */
	static function toJson($puzzle, $pretty=False) {
		$data = static::encodePuzzle($puzzle);
		return static::dataToString($data, $pretty);
	}
	
	/**
	 * @param Array<Puzzle> $puzzles
	 * @param boolean [$pretty]
	 * @return string
	 */
	static function toJsonArray($puzzles, $pretty=False) {
		$dataArray = array();
		foreach ($puzzles as $puzzle) {
			$data = static::encodePuzzle($puzzle);
			array_push($dataArray, $data);
		}
		return static::dataToString($dataArray, $pretty);
	}
	
	/**
	 * @param object $data
	 * @param boolean $pretty
	 * @return string
	 */
	private static function dataToString($data, $pretty) {
		return json_encode($data, ($pretty) ? JSON_PRETTY_PRINT : 0);
	}
	
	/**
	 * @param Puzzle $puzzle
	 * @return object
	 */
	private static function encodePuzzle($puzzle) {
		if ($puzzle === null) {
			return null;
		}
		
		$encodedId = $puzzle->id;
		
		$encodedFragments = array();
		foreach ($puzzle->sentenceFragments as $fragment) {
			$encodedFragment = static::encodeSentenceFragment($fragment);
			array_push($encodedFragments, $encodedFragment);
		}
		
		$encodedOptions = array();
		foreach ($puzzle->options as $option) {
			$encodedOption = static::encodeOption($option);
			array_push($encodedOptions, $encodedOption);
		}
		
		return array(
			"id" => $encodedId,
			"sentenceFragments" => $encodedFragments,
			"options" => $encodedOptions
		);
	}
	
	/**
	 * @param SentenceFragment $fragment
	 * @return object
	 */
	private static function encodeSentenceFragment($fragment) {
		if ($fragment === null) {
			return null;
			
		} else if ($fragment instanceof Character) {
			return array(
				"type" => "Character",
				"value" => $fragment->value
			);
		} else if ($fragment instanceof Gap) {
			return array(
				"type" => "Gap",
				"solution" => static::encodeOption($fragment->solution)
			);
		} else {
			throw new Exception("Unsupported SentenceFragment type: $fragment");
		}
	}
	
	/**
	 * @param Option $option
	 * @return object
	 */
	private static function encodeOption($option) {
		return ($option === null) ? null : array(
			"value" => $option->value
		);
	}
	
	private function __construct() {
		throw new Exception("Use the static methods");
	}
}
?>
