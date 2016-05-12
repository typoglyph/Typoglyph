/**
 * Used to track statistics about the puzzles the user has answered
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
		 * @return {Array<Statistic>} All recorded statistics
		 */
		getStatistics: function() {
			return this.stats;
		},
		/**
		 * @return {Array<Statistic>} All recorded statistics whcih represent a correctly answered
		 *     puzzle
		 */
		getCorrectlyAnsweredStatistics: function() {
			return this.stats.filter(
				function(item) {
					return item.result;
				});
		},
		/**
		 * @return {Array<Statistic>} All recorded statistics which represent an incorrectly
		 *     answered puzzle
		 */
		getIncorrectlyAnsweredStatistics: function() {
			return this.stats.filter(
				function(item) {
					return !item.result;
				});
		},
		/**
		 * @return {Statistic} The most recently recorded statistic, or null if no statistics have
		 *     yet been recorded
		 */
		getLatestStatistic: function() {
			if (this.stats.length === 0)
				return null;
			var stat = this.stats[this.stats.length - 1];
			return stat;
		},
		
		/**
		 * Used to clear all stored statistics
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
