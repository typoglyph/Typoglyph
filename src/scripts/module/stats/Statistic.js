/**
 * Used to store information about a single answered puzzle
 * 
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	return {
		/**
		 * @param {puzzle/Puzzle} puzzle
		 * @param {boolean} result True if the puzzle was answered correctly
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
