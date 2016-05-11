/**
 * A gap represents a space within a puzzle's sentence which can be filled in with an option. An
 * option is filled correctly when its solution matches the current choice.
 * 
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	var nextId = 0;
	return {
		/**
		 * @param {int} position Where in a puzzle this gap should lie:
		 *     0: just before the first character of a puzzle's sentence
		 *     1: just after the first character of a puzzle's sentence
		 *     sentence.length: just after the last character of a puzzle's sentence
		 * @param {Option} solution The value this gap must be filled with if it is to be considered
		 *     "correct". If null, the gap will be correct if it hasn't been filled.
		 * @constructor
		 */
		create: function(position, solution) {
			var self = Objects.subclass(this, {
				id: nextId++,
				position: position,
				solution: solution,
				currentChoice: null
			});
			return self;
		},
		
		/**
		 * @return {boolean}
		 */
		isFilled: function() {
			return this.currentChoice !== null;
		},
		/**
		 * @return {boolean}
		 */
		isFilledCorrectly: function() {
			return Objects.equals(this.currentChoice, this.solution);
		},
		
		/**
		 * @return {String}
		 */
		toString: function() {
			return "{" + (this.solution === null ? "" : this.solution) + "}";
		},
		/**
		 * @param {Gap} other
		 * @return {boolean}
		 */
		equals: function(other) {
			return other !== null
				&& Objects.equals(this.position, other.position)
				&& Objects.equals(this.solution, other.solution)
				&& Objects.equals(this.currentChoice, other.currentChoice);
		}
	};
});
