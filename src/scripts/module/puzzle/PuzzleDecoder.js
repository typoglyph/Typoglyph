/**
 * Utilities for parsing puzzles from various external formats such as JSON. All publicly-visible
 * functions should have a compatible counterpart in PuzzleEncoder.
 *
 * @author jakemarsden
 * @see PuzzleEncoder
 */
define([
	"./Character",
	"./Gap",
	"./Option",
	"./Puzzle"
], function (Character, Gap, Option, Puzzle) {
	
	return {
		/**
		 * The output of this function is compatible with PuzzleEncoder#toJson
		 * <p>
		 * Example input:
		 * <pre>
		 * {
		 *   "id" : 1,
		 *   "sentenceFragments": [
		 *     { "type": "Character", "value": "H" },
		 *     { "type": "Character", "value": "e" },
		 *     { "type": "Character", "value": "l" },
		 *     { "type": "Character", "value": "l" },
		 *     { "type": "Character", "value": "o" },
		 *     { "type": "Gap", "solution": null },
		 *     { "type": "Character", "value": "w" },
		 *     { "type": "Character", "value": "o" },
		 *     { "type": "Character", "value": "r" },
		 *     { "type": "Character", "value": "l" },
		 *     { "type": "Character", "value": "d" },
		 *     { "type": "Gap", "solution": { "value": "!" }}
		 *   ],
		 *   "options": [
		 *     { "value": "." },
		 *     { "value": "," },
		 *     { "value": "!" },
		 *     { "value": "?" }
		 *   ]
		 * }
		 * </pre>
		 *
		 * @param {String} json
		 * @return {Puzzle}
		 */
		fromJson: function(json) {
			var data = JSON.parse(json);
			return decodePuzzle(data);
		},
		
		/**
		 * The output of this function is compatible with PuzzleEncoder#toJsonArray
		 * <p>
		 * Example input:
		 * <pre>
		 * [
		 *   {
		 *     "id" : 1,
		 *     "sentenceFragments": [
		 *       { "type": "Character", "value": "H" },
		 *       { "type": "Character", "value": "e" },
		 *       { "type": "Character", "value": "l" },
		 *       { "type": "Character", "value": "l" },
		 *       { "type": "Character", "value": "o" },
		 *       { "type": "Gap", "solution": null },
		 *       { "type": "Character", "value": "w" },
		 *       { "type": "Character", "value": "o" },
		 *       { "type": "Character", "value": "r" },
		 *       { "type": "Character", "value": "l" },
		 *       { "type": "Character", "value": "d" },
		 *       { "type": "Gap", "solution": { "value": "!" }}
		 *     ],
		 *     "options": [
		 *       { "value": "." },
		 *       { "value": "," },
		 *       { "value": "!" },
		 *       { "value": "?" }
		 *     ]
		 *   },
		 *   //... more puzzle definitions
		 * ]
		 * </pre>
		 *
		 * @param {String} json
		 * @return {Array<Puzzle>}
		 */
		fromJsonArray: function(json) {
			var dataArray = JSON.parse(json);
			var decodedPuzzles = [];
			for (var i = 0; i < dataArray.length; i++) {
				var decodedPuzzle = decodePuzzle(dataArray[i]);
				decodedPuzzles.push(decodedPuzzle);
			}
			return decodedPuzzles;
		}
	};
	
	
	/**
	 * <code>Puzzle#sentenceFragments</code> can contain instances of a mixture of different
	 * <code>SentenceFragment</code> subclasses. This is why the <code>"type"</code> attribute has
	 * been added to the JSON. Currently only <code>Character</code> and <code>Gap</code> instances
	 * can be decoded.
	 * 
	 * @param {Object} data
	 * @return {Puzzle}
	 */
	function decodePuzzle(data) {
		if (data === null) {
			return null;
		}
		
		var decodedId = data.id;
		
		var decodedFragments = [];
		for (var i = 0; i < data.sentenceFragments.length; i++) {
			var decodedFragment = decodeSentenceFragment(data.sentenceFragments[i]);
			decodedFragments.push(decodedFragment);
		}
		
		var decodedOptions = [];
		for (var i = 0; i < data.options.length; i++) {
			var decodedOption = decodeOption(data.options[i]);
			decodedOptions.push(decodedOption);
		}
		
		return Puzzle.create(decodedId, decodedFragments, decodedOptions);
	}
	
	/**
	 * @param {object} data
	 * @return {SentenceFragment}
     */
	function decodeSentenceFragment(data) {
		if (data === null) {
			return null;
			
		} else if ((data.type || "").toLowerCase() === "character") {
			return Character.create(data.value);
			
		} else if ((data.type || "").toLowerCase() === "gap") {
			var decodedSolution = decodeOption(data.solution);
			return Gap.create(decodedSolution);
			
		} else {
			throw "Unsupported SentenceFragment type: " + data.type;
		}
	}
	
	/**
	 * @param {object} data
	 * @return {Option}
	 */
	function decodeOption(data) {
		return (data === null) ? null : Option.create(data.value);
	}
});
