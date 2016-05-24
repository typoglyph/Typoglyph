<?php
class Puzzle {
	public $id;
	public $sentence = "";
	public $gaps = array();
	public $options = array();
}


class Gap {
	public $position = Null;
	public $solution = Null;
	public $currentChoice = Null;
}


class Option {
	public $value = Null;
}


class PuzzleParser {
	
	/**
	 * @param string $json
	 * @return Puzzle
	 */
	static function fromJson($json) {
		$data = json_decode($json);
		return static::parsePuzzle($data);
	}
	
	/**
	 * @param string $json
	 * @return Array<Puzzle>
	 */
	static function fromJsonArray($json) {
		$data = json_decode($json);
		$puzzles = array();
		foreach ($data as $puzzleData) {
			$puzzle = static::parsePuzzle($puzzleData);
			array_push($puzzles, $puzzle);
		}
		return $puzzles;
	}

	private static function parsePuzzle($data) {
		$puzzle = new Puzzle();
		$puzzle->id = isset($data->id) ? $data->id : Null;
		$puzzle->sentence = isset($data->sentence) ? $data->sentence : Null;
		foreach ((isset($data->gaps) ? $data->gaps : array()) as $gapData) {
			array_push($puzzle->gaps, static::parseGap($gapData));
		}
		foreach ((isset($data->options) ? $data->options : array()) as $optionData) {
			array_push($puzzle->options, static::parseOption($optionData));
		}
		return $puzzle;
	}

	private static function parseGap($data) {
		$gap = new Gap();
		$gap->position = isset($data->position) ? $data->position : Null;
		$gap->solution = isset($data->solution) ? static::parseOption($data->solution) : Null;
		$gap->currentChoice = isset($data->currentChoice) ? static::parseOption($data->currentChoice) : Null;
		return $gap;
	}

	private static function parseOption($data) {
		$option = new Option();
		$option->value = isset($data->value) ? $data->value : Null;
		return $option;
	}
	
	
	private function __construct() {
		throw new Exception("Use the static methods");
	}
}
?>
