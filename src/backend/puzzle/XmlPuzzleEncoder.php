<?php
require_once("_lib/fluidxml-v1.20.2/FluidXml.php");
require_once("puzzle/Character.php");
require_once("puzzle/Gap.php");


class XmlPuzzleEncoder {
	/**
	 * @param Puzzle $puzzle
	 * @param boolean [$pretty] Does nothing. Will always pretty print.
	 * @return string
	 */
	static function toXml($puzzle, $pretty=False) {
		$puzzleXml = static::encodePuzzle($puzzle);
		return $puzzleXml->xml();
	}
	
	/**
	 * @param Array<Puzzle> $puzzles
	 * @param boolean [$pretty] Does nothing. Will always pretty print.
	 * @return string
	 */
	static function toXmlArray($puzzles, $pretty=False) {
		$puzzlesXml = new FluidXml\FluidXml("puzzles");
		foreach ($puzzles as $puzzle) {
			$puzzleXml = static::encodePuzzle($puzzle);
			$puzzlesXml->addChild($puzzleXml); 
		}
		return $puzzlesXml->xml();
	}
	
	/**
	 * @param Puzzle $puzzle
	 * @return FluidXml\FluidInterface
	 */
	private static function encodePuzzle($puzzle) {
		$xml = new FluidXml\FluidXml("puzzle");
		$xml->addChild("id", $puzzle->id);
		
		$sentenceXml = new FluidXml\FluidXml("sentence");
		foreach ($puzzle->sentenceFragments as $fragment) {
			$fragmentXml = static::encodeSentenceFragment($fragment);
			$sentenceXml->addChild($fragmentXml);
		}
		$xml->addChild($sentenceXml);
		
		$optionsXml = new FluidXml\FluidXml("options");
		foreach ($puzzle->options as $option) {
			$optionXml = static::encodeOption($option);
			$optionsXml->addChild($optionXml);
		}
		$xml->addChild($optionsXml);
		
		return $xml;
	}
	
	/**
	 * @param SentenceFragment $fragment
	 * @return FluidXml\FluidInterface
	 */
	private static function encodeSentenceFragment($fragment) {
		if ($fragment instanceof Character) {
			$xml = new FluidXml\FluidXml("character");
			$xml->setText($fragment->value);
			return $xml;
		}
		if ($fragment instanceof Gap) {
			$xml = new FluidXml\FluidXml("gap");
			if ($fragment->solution !== null) {
				$xml->setText($fragment->solution->value);
			}
			return $xml;
		}
		throw new Exception("Unknown SentenceFragment type: $fragment");
	}
	
	/**
	 * @param Option $option
	 * @return FluidXml\FluidInterface
	 */
	private static function encodeOption($option) {
		$xml = new FluidXml\FluidXml("option");
		$xml->setText($option->value);
		return $xml;
	}
}
?>
