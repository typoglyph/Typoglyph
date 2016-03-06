// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};


/**
 * Used to track the puzzles which the user has answered since the latest page (re)load
 *
 * @constructor
 * @author jakemarsden
 */
typoglyph.StatisticsTracker = function() {
	/** @private */ var _correctPuzzles = 0;
	/** @private */ var _answeredPuzzles = 0;
	/** @private */ var _latestResult = null;
	
	/**
	 * @return {int} How many puzzles the user has answered correctly
	 */
	this.getCorrectlyAnsweredPuzzlesCount = function() {
		return _correctPuzzles;
	}
	
	/**
	 * @return {int} How many puzzles the user has answered
	 */
	this.getAnsweredPuzzlesCount = function() {
		return _answeredPuzzles;
	}
	
	/**
	 * @return {boolean} True if the most recently answered puzzle was answered correctly, null if
	 *     no puzzles have yet been answered, false otherwise
	 */
	this.wasLatestAnswerCorrect = function() {
		return _latestResult;
	}
	
	/**
	 * @param {typoglyph.puzzle.Puzzle} puzzle
	 * @param {boolean} correct
	 */
	this.onPuzzleAnswered = function(puzzle, correct) {
		if (correct) {
			_correctPuzzles++;
		}
		_answeredPuzzles++;
		_latestResult = correct;
	}
}
