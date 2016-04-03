// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};


/**
 * Used to track statistics about the puzzles the user has answered
 * 
 * @author jakemarsden
 */
typoglyph.StatisticsTracker = {
	/**
	 * @constructor
	 */
	create: function() {
		var self = Objects.subclass(this, {
			correctPuzzles: [],
			incorrectPuzzles: [],
			latestResult: null
		});
		return self;
	},
	
	/**
	 * @return {int} Get the total number of answered puzzles, regardless of if they were correct
	 */
	getAnsweredPuzzlesCount: function() {
		return this.getCorrectlyAnsweredPuzzlesCount() + this.getIncorrectlyAnsweredPuzzlesCount();
	},
	/**
	 * @return {int}
	 */
	getCorrectlyAnsweredPuzzlesCount: function() {
		return this.correctPuzzles.length;
	},
	/**
	 * @return {int}
	 */
	getIncorrectlyAnsweredPuzzlesCount: function() {
		return this.incorrectPuzzles.length;
	},
	/**
	 * @return {typoglyph.puzzle.Puzzle} The puzzle which was answered the most recently
	 */
	getLatestAnsweredPuzzle: function() {
		if (this.latestResult === null)
			return null;
		return (this.result) ? this.correctPuzzles[this.correctPuzzles.length -1]
			: this.incorrectPuzzles[this.incorrectPuzzles.length - 1];
	},
	
	/**
	 * Used to clear all stored statistics
	 */
	reset: function() {
		this.correctPuzzles = [];
		this.incorrectPuzzles = [];
		this.latestResult = null;
	},
	
	/**
	 * Used to update statistics after a puzzle has been answered
	 * 
	 * @param {typoglyph.puzzle.Puzzle} puzzle
	 * @param {boolean} correct
	 */
	onPuzzleAnswered: function(puzzle, correct) {
		(correct ? this.correctPuzzles : this.incorrectPuzzles).push(puzzle);
		this.latestResult = correct;
	}
};
