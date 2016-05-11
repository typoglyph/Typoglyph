/**
 * Functions for managing puzzles, ie. fetching them from the backend
 * 
 * @author jakemarsden
 */
define(["jquery", "./Gap", "./Option", "./Puzzle"], function($, Gap, Option, Puzzle) {
	return {
		/**
		 * @param {function(Array<puzzle/Puzzle>)} callback The function to call on success
		 */
		fetchAllPuzzles: function(callback) {
			var url = "../backend/getAllPuzzles.php";
			var queryParams = {};
			fetchPuzzles(url, queryParams, callback)
		},
		
		/**
		 * @param {int} count How many puzzles to fetch
		 * @param {function(Array<puzzle/Puzzle>)} callback The function to call on success
		 */
		fetchRandomPuzzles: function(count, callback) {
			var url = "../backend/getRandomPuzzles.php";
			var queryParams = { count: count };
			fetchPuzzles(url, queryParams, callback)
		}
	};
	
	/**
	 * @param {String} url
	 * @param {Object} queryParams
	 * @param {function(Array<puzzle/Puzzle>)} callback
	 */
	function fetchPuzzles(url, queryParams, callback) {
		$.getJSON(url, queryParams, function(result, status, xhr) {
			console.debug("fetchPuzzlesFromBackend[" + url + "]: result=" + result + ", status=" + status + ", xhr=" + xhr);
			callback(parsePuzzles(result));
		});
	}
	
	/**
	 * @param {Array<Object>} jsonPuzzles
	 * @return {Array<Puzzle>}
	 */
	function parsePuzzles(jsonPuzzles) {
		var puzzles = [];
		for (var i = 0; i < jsonPuzzles.length; i++) {
			var jsonPuzzle = jsonPuzzles[i];
			var jsonGaps = jsonPuzzle.gaps;
			var jsonOptions = jsonPuzzle.options;
			var gaps = [];
			var options = [];
			for (var j = 0; j < jsonGaps.length; j++) {
				var jsonGap = jsonGaps[j];
				var solution = (jsonGap.solution === null) ? null : Option.create(jsonGap.solution.value);
				var gap = Gap.create(jsonGap.position, solution);
				if (jsonGap.currentChoice !== null) {
					gap.currentChoice = Option.create(jsonGap.currentChoice.value);
				}
				gaps.push(gap);
			}
			for (var j = 0; j < jsonOptions.length; j++) {
				var jsonOption = jsonOptions[j];
				var option = Option.create(jsonOption.value);
				options.push(option);
			}
			var puzzle = Puzzle.create(jsonPuzzle.id, jsonPuzzle.sentence, options, gaps);
			puzzles.push(puzzle);
		}
		return puzzles;
	}
});
