/**
 * Utilities for converting puzzles into various external formats such as JSON. All publicly-visible
 * functions should have a compatible counterpart in PuzzleDecoder.
 * 
 * @author jakemarsden
 * @see PuzzleDecoder
 */
define([
	"./Character",
	"./Gap",
	"util/Objects"
], function (Character, Gap, Objects) {
	
	return {
		/**
		 * The output of this function is compatible with PuzzleDecoder#fromJson. See
		 * documentation there for an example of the output produced by this function.
		 * 
		 * @param {Puzzle} puzzle
		 * @return {String}
		 */
		toJson: function(puzzle) {
			var data = encodePuzzle(puzzle);
			return JSON.stringify(data);
		},
		
		/**
		 * The output of this function is compatible with PuzzleDecoder#fromJsonArray. See
		 * documentation there for an example of the output produced by this function.
		 * 
		 * @param {Array<Puzzle>} puzzles
		 * @return {String}
		 */
		toJsonArray: function(puzzles) {
			var dataArray = [];
			for (var i = 0; i < puzzles.length; i++) {
				var data = encodePuzzle(puzzles[i]);
				dataArray.push(data);
			}
			return JSON.stringify(dataArray);
		}
	};
	
	
	/**
	 * <code>Puzzle#sentenceFragments</code> can contain instances of a mixture of different
	 * <code>SentenceFragment</code> subclasses. This is why the <code>"type"</code> attribute has
	 * been added to the JSON. Currently only <code>Character</code> and <code>Gap</code> instances
	 * can be encoded.
	 * 
	 * @param {Puzzle} puzzle
	 * @return {Object}
	 */
	function encodePuzzle(puzzle) {
		if (puzzle === null) {
			return null;
		}
		
		var encodedId = puzzle.id;
		
		var encodedFragments = [];
		for (var i = 0; i < puzzle.length(); i++) {
			var fragment = puzzle.getSentenceFragmentAt(i);
			var encodedFragment = encodeSentenceFragment(fragment);
			encodedFragments.push(encodedFragment);
		}
		
		var encodedOptions = [];
		for (var i = 0; i < puzzle.options.length; i++) {
			var encodedOption = encodeOption(puzzle.options[i]);
			encodedOptions.push(encodedOption);
		}
		
		return {
			id: encodedId,
			sentenceFragments: encodedFragments,
			options: encodedOptions
		};
	}
	
	/**
	 * @param {SentenceFragment} fragment
	 * @return {object}
	 */
	function encodeSentenceFragment(fragment) {
		if (fragment === null) {
			return null;
			
		} else if (Objects.isInstanceOf(fragment, Character)) {
			return {
				type: "Character",
				value: fragment.value
			};
		} else if (Objects.isInstanceOf(fragment, Gap)) {
			return {
				type: "Gap",
				solution: encodeOption(fragment.solution)
			};
		} else {
			throw "Unsupported SentenceFragment type: " + fragment;
		}
	}
	
	/**
	 * @param {Option} option
	 * @return {Object}
	 */
	function encodeOption(option) {
		return (option === null) ? null : {
			value: option.value
		};
	}
});
