/**
 * The process of solving a puzzle consists of populating its gaps with options. A puzzle is solved
 * correctly when all of its gaps contain the correct option.
 * 
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	return {
		/**
		 * @param {String} sentence The main part of a puzzle
		 * @param {Array<Option>} options The values which can be used to populate the puzzle's gaps
		 *     (each option can be used zero or more times)
		 * @param {Array<Gap>} gaps Represents the places in the sentence where an option can be
		 *     inserted
		 * @constructor
		 */
		create: function(sentence, options, gaps) {
			var self = Objects.subclass(this, {
				sentence: sentence,
				options: options,
				gaps: gaps
			});
			return self;
		},
		
		/**
		 * @param {int} id
		 * @return {Option} The option of this puzzle which has the specified ID, or null if the puzzle
		 *     doesn't have any options with that ID
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
		 * @param {int} id
		 * @return {Gap} The gap of this puzzle which has the specified ID, or null if the puzzle
		 *     doesn't have any gaps with that ID
		 */
		getGapById: function(id) {
			for (var i = 0; i < this.gaps.length; i++) {
				if (this.gaps[i].id === id) {
					return this.gaps[i];
				}
			}
			return null;
		},
		/**
		 * @param {int} position
		 * @return {Gap} The gap of this puzzle which has the specified position, or null if the puzzle
		 *     doesn't have any gaps at that position
		 */
		getGapAtPosition: function(position) {
			for (var i = 0; i < this.gaps.length; i++) {
				if (this.gaps[i].position === position) {
					return this.gaps[i];
				}
			}
			return null;
		},
		
		/**
		 * @return {boolean}
		 */
		areAllGapsFilled: function() {
			for (var i = 0; i < this.gaps.length; i++) {
				if (!this.gaps[i].isFilled()) {
					return false;
				}
			}
			return true;
		},
		/**
		 * @return {boolean}
		 */
		areAllGapsFilledCorrectly: function() {
			for (var i = 0; i < this.gaps.length; i++) {
				if (!this.gaps[i].isFilledCorrectly()) {
					return false;
				}
			}
			return true;
		},
		
		/**
		 * @return {String}
		 */
		toString: function() {
			var str = "";
			for (var i = 0; i <= this.sentence.length; i++) {
				var gap = this.getGapAtPosition(i);
				if (gap !== null) {
					str += gap;
				}
				str += this.sentence.charAt(i);
			}
			return str;
		},
		/**
		 * @return {boolean}
		 */
		equals: function(other) {
			return other !== null
				&& Objects.equals(this.sentence, other.sentence)
				&& Objects.equals(this.options, other.options)
				&& Objects.equals(this.gaps, other.gaps);
		}
	};
});
