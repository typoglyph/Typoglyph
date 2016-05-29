/**
 * The process of solving a puzzle consists of populating its gaps with options. A puzzle is solved
 * correctly when all of its gaps contain the correct option.
 * 
 * @author jakemarsden
 */
define([
	"./Character",
	"./Gap",
	"util/Objects"
], function(Character, Gap, Objects) {
	
	return {
		/**
		 * @param {int} id
		 * @param {Array<SentenceFragment>} sentenceFragments The main part of the puzzle which is
		 *     made up of fixed characters and places where options can be inserted
		 * @param {Array<Option>} options The values which can be used to populate the puzzle's gaps
		 *     (each option can be used zero or more times)
		 * @constructor
		 */
		create: function(id, sentenceFragments, options) {
			return Objects.subclass(this, {
				id: id,
				sentenceFragments: sentenceFragments,
				options: options
			});
		},
		
		/**
		 * @param {int} id
		 * @return {Option} The option of this puzzle which has the specified ID, or null if the puzzle
		 *     doesn't have an option with that ID
		 */
		getOptionById: function(id) {
			for (var i = 0; i < this.options.length; i++) {
				if (this.options[i].id === id) {
					return this.options[i];
				}
			}
			return null;
		},
		
		/**
		 * <pre>
		 * var puzzle = //...
		 *
		 * for (var i = 0; i < puzzle.length(); i++) {
		 *   var fragment = puzzle.getSentenceFragmentAt(i);
		 *   if (Objects.isInstanceOf(fragment, Character)) {
		 *     //...
		 *   } else if (Objects.isInstanceOf(fragment, Gap)) {
		 *     //...
		 *   } else {
		 *     throw "Unknown SentenceFragment type: " + fragment;
		 *   }
		 * }
		 * </pre>
		 *
		 * @return {int} How many sentence fragments (gaps and characters) are in this puzzle's
		 *     sentence
		 */
		length: function() {
			return this.sentenceFragments.length;
		},

		/**
		 * @param {int} position
		 * @return {SentenceFragment} The fragment of this puzzle's sentence which is at the specified
		 *     position. An exception is thrown if there is no fragment at the given position.
		 */
		getSentenceFragmentAt: function(position) {
			if (position < 0 || position >= this.length()) {
				throw "IndexOutOfBoundsException: " + position;
			}
			return this.sentenceFragments[position];
		},
		/**
		 * @param {int} id
		 * @return {SentenceFragment} The fragment of this puzzle's sentence which has the specified
		 *     ID, or null if the sentence doesn't have a fragment with that ID
		 */
		getSentenceFragmentById: function(id) {
			for (var i = 0; i < this.length(); i++) {
				var frag = this.getSentenceFragmentAt(i);
				if (frag.id === id) {
					return frag;
				}
			}
			return null;
		},

		listSentenceCharacters: function() {
			var characters = [];
			for (var i = 0; i < this.length(); i++) {
				var frag = this.getSentenceFragmentAt(i);
				if (Objects.isInstanceOf(frag, Character)) {
					characters.push(frag);
				}
			}
			return characters;
		},
		listSentenceGaps: function() {
			var gaps = [];
			for (var i = 0; i < this.length(); i++) {
				var frag = this.getSentenceFragmentAt(i);
				if (Objects.isInstanceOf(frag, Gap)) {
					gaps.push(frag);
				}
			}
			return gaps;
		},

		/**
		 * @return {boolean}
		 */
		areAllGapsFilled: function() {
			var gaps = this.listSentenceGaps();
			for (var i = 0; i < gaps.length; i++) {
				if (!gaps[i].isFilled()) {
					return false;
				}
			}
			return true;
		},
		/**
		 * @return {boolean}
		 */
		areAllGapsFilledCorrectly: function() {
			var gaps = this.listSentenceGaps();
			for (var i = 0; i < gaps.length; i++) {
				if (!gaps[i].isFilledCorrectly()) {
					return false;
				}
			}
			return true;
		},

		/**
		 * @return {String}
		 */
		toString: function() {
			var str = "Puzzle[id=" + this.id + ", sentence=";
			for (var i = 0; i < this.length(); i++) {
				var frag = this.getSentenceFragmentAt(i);
				str += frag.toString();
			}
			return str + "]";
		},
		/**
		 * @param {Puzzle} other
		 * @return {boolean}
		 */
		equals: function(other) {
			return other !== null
				&& Objects.equals(this.sentenceFragments, other.sentenceFragments)
				&& Objects.equals(this.options, other.options);
		}
	};
});
