/**
 * Used to track information about the puzzles the user has answered in the current set. This
 * information is stored as <code>Statistic</code> instances.
 * 
 * @author jakemarsden
 */
define(["util/Objects", "./Statistic"], function(Objects, Statistic) {
	return {
		/**
		 * @constructor
		 */
		create: function() {
			var self = Objects.subclass(this, {
				stats: []
			});
			return self;
		},
		
		/**
		 * @return {Array<Statistic>} All recorded statistics, ordered with the oldest at index 0
		 */
		getStatistics: function() {
			return this.stats;
		},
		/**
		 * @return {Array<Statistic>} All recorded statistics representing a correctly answered
		 *     puzzle, ordered with the oldest at index 0
		 */
		getCorrectlyAnsweredStatistics: function() {
			return this.getStatistics().filter(function(item) {
				return item.result;
			});
		},
		/**
		 * @return {Array<Statistic>} All recorded statistics representing an incorrectly answered
		 *     puzzle, ordered with the oldest at index 0
		 */
		getIncorrectlyAnsweredStatistics: function() {
			return this.getStatistics().filter(function(item) {
				return !item.result;
			});
		},
		/**
		 * @return {Statistic} The most recently recorded statistic, or null if no statistics have
		 *     been recorded yet
		 */
		getLatestStatistic: function() {
			var stats = this.getStatistics();
			return (stats.length === 0) ? null : stats[stats.length - 1];
		},
		
		/**
		 * Clears all stored statistics
		 */
		reset: function() {
			this.stats = [];
		},
		
		/**
		 * Used to update statistics after a puzzle has been answered
		 * 
		 * @param {puzzle/Puzzle} puzzle
		 * @param {boolean} correct
		 */
		onPuzzleAnswered: function(puzzle, correct) {
			var stat = Statistic.create(puzzle, correct);
			this.stats.push(stat);
		}
	};
});
