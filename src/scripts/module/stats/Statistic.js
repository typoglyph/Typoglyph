/**
 * Used to store information about a single puzzle answered by the user. Used in conjunction with
 * the <code>StatisticsTracker</code> class.
 * 
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	return {
		/**
		 * @param {puzzle/Puzzle} puzzle The puzzle which was answered
		 * @param {boolean} result True if the puzzle was answered correctly or false if it was
		 *     answered incorrectly
		 * @constructor
		 */
		create: function(puzzle, result) {
			var self = Objects.subclass({
				puzzle: puzzle,
				result: result
			});
			return self;
		}
	};
});
