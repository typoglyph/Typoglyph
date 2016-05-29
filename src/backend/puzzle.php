<?php
/**
 * Very basic translations of Puzzle.js, SentenceFragment.js, Character.js, Gap.js and Option.js,
 * to be used by the server-side.
 */
class Puzzle {
	public $id;
	public $sentenceFragments;
	public $options;
	
	public function __construct($id = Null, $sentenceFragments = array(), $options = array()) {
		$this->id = $id;
		$this->sentenceFragments = $sentenceFragments;
		$this->options = $options;
	}
}


class SentenceFragment {
}


class Character extends SentenceFragment {
	public $value;
	
	public function __construct($value = Null) {
		$this->value = $value;
	}
}


class Gap extends SentenceFragment {
	public $solution;
	
	public function __construct($solution = Null) {
		$this->solution = $solution;
	}
}


class Option {
	public $value;
	
	public function __construct($value = Null) {
		$this->value = $value;
	}
}


/**
 * Translation of PuzzleEncoder.js. Look there for documentation.
 * <p>
 * Utilities for converting puzzles into various external formats such as JSON. All publicly-visible
 * methods should have a compatible counterpart in PuzzleDecoder.
 */
class PuzzleEncoder {
	/**
	 * @param Puzzle $puzzle
	 * @return string
	 */
	static function toJson($puzzle) {
		$data = static::encodePuzzle($puzzle);
		return json_encode($data);
	}
	
	/**
	 * @param Array<Puzzle> $puzzles
	 * @return string
	 */
	static function toJsonArray($puzzles) {
		$dataArray = array();
		foreach ($puzzles as $puzzle) {
			$data = static::encodePuzzle($puzzle);
			array_push($dataArray, $data);
		}
		return json_encode($dataArray);
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
