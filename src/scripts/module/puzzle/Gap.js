/**
 * A gap represents a space within a puzzle's sentence which can be filled in with an option. An
 * option is filled correctly when its solution matches the current choice.
 * 
 * @author jakemarsden
 */
define(["./SentenceFragment", "util/Objects"], function(SentenceFragment, Objects) {
	
	return Objects.subclass(SentenceFragment, {
		/**
		 * @param {Option} solution The value this gap must be filled with if it is to be considered
		 *     "correct". If null, the gap will be correct if it hasn't been filled.
		 * @param {Option} [initialChoice=null] The option to initially fill this gap with. By
		 *     default, or if null is passed, the gap will start unfilled.
		 * @constructor
		 */
		create: function(solution, initialChoice) {
			var self = SentenceFragment.create.call(this);
			self.solution = solution;
			self.currentChoice = initialChoice || null;
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
				&& Objects.equals(this.solution, other.solution)
				&& Objects.equals(this.currentChoice, other.currentChoice);
		}
	});
});
