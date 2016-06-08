<?php
require_once("puzzle/Character.php");
require_once("puzzle/Gap.php");


class CsvPuzzleEncoder {
	/**
	 * @param Puzzle $puzzle
	 * @param string [delimiter]
	 * @param string [enclosure]
	 * @param string [lineSep]
	 * @return string
	 */
	static function toCsv($puzzle, $delimiter=",", $enclosure="\"", $lineSep="\n") {
		return static::toCsvArray(array($puzzle), $delimiter, $enclosure, $lineSep);
	}
	
	/**
	 * @param Array<Puzzle>
	 * @param string [delimiter]
	 * @param string [enclosure]
	 * @param string [lineSep]
	 * @return string
	 */
	static function toCsvArray($puzzles, $delimiter=",", $enclosure="\"", $lineSep="\n") {
		$csv = static::str_putcsv(array("ID", "Sentence", "Options"));
		foreach ($puzzles as $puzzle) {
			$encodedPuzzle = static::encodePuzzle($puzzle);
			$csv .= $lineSep;
			$csv .= static::str_putcsv($encodedPuzzle, $delimiter, $enclosure);
		}
		return $csv;
	}
	
	/**
	 * @param Puzzle $puzzle
	 * @return Array<string>
	 */
	private static function encodePuzzle($puzzle) {
		$encodedId = $puzzle->id;
		$encodedFragments = static::encodeSentenceFragments($puzzle->sentenceFragments);
		$encodedOptions = static::encodeOptions($puzzle->options);
		
		$encodedPuzzle = array($encodedId, $encodedFragments);
		return array_merge($encodedPuzzle, $encodedOptions);
	}
	
	/**
	 * @param Array<SentenceFragment>
	 * @return string
	 */
	private static function encodeSentenceFragments($fragments) {
		$str = "";
		foreach ($fragments as $fragment) {
			if ($fragment instanceof Character) {
				$str .= static::escapeForSentence($fragment->value);
			} else if ($fragment instanceof Gap) {
				$str .= "{";
				if ($fragment->solution !== null) {
					$str .= static::escapeForSentence($fragment->solution->value);
				}
				$str .= "}";
			} else {
				throw new Exception("Unknown SentenceFragment type: $fragment");
			}
		}
		return $str;
	}
	
	/**
	 * @param string $str
	 * @return string
	 */
	private static function escapeForSentence($str) {
		$escaped = "";
		for ($i = 0; $i < strlen($str); $i++) {
			if ($str[$i] === "\\"
					|| $str[$i] === "{"
					|| $str[$i] === "}") {
				$escaped .= "\\";
			}
			$escaped .= $str[$i];
		}
		return $escaped;
	}
	
	/**
	 * @param Array<Option> $options
	 * @return Array<string>
	 */
	private static function encodeOptions($options) {
		$encodedOptions = array();
		foreach ($options as $option) {
			$encodedOption = $option->value;
			array_push($encodedOptions, $encodedOption);
		}
		return $encodedOptions;
	}
	
	/**
	 * @param Array<Array<string>> $input
	 * @param string [$delimiter]
	 * @param string [$enclosure]
	 * @return string
	 * 
	 * @see https://gist.github.com/johanmeiring/2894568#file-gistfile1-aw-L8
	 * @see http://stackoverflow.com/questions/16352591/convert-php-array-to-csv-string
	 */
	private static function str_putcsv($input, $delimiter = ',', $enclosure = '"') {
        // Open a memory "file" for read/write...
        $fp = fopen('php://temp', 'r+');
        // ... write the $input array to the "file" using fputcsv()...
        fputcsv($fp, $input, $delimiter, $enclosure);
        // ... rewind the "file" so we can read what we just wrote...
        rewind($fp);
        // ... read the entire line into a variable...
        $data = fread($fp, 1048576);
        // ... close the "file"...
        fclose($fp);
        // ... and return the $data to the caller, with the trailing newline from fgets() removed.
        return rtrim($data, "\n");
    }
}
?>
