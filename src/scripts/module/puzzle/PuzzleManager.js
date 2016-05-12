/**
 * Functions for managing puzzles, ie. fetching them from the backend
 * 
 * @author jakemarsden
 */
define(["./Gap", "./Option", "./Puzzle"], function(Gap, Option, Puzzle) {
	return {
		/**
		 * @param {function(Array<puzzle/Puzzle>)} callback The function to call on success
		 */
		fetchAllPuzzles: function(callback) {
			var url = "backend/getAllPuzzles.php";
			fetchPuzzles(url, callback)
		},
		
		/**
		 * @param {int} count How many puzzles to fetch
		 * @param {function(Array<puzzle/Puzzle>)} callback The function to call on success
		 */
		fetchRandomPuzzles: function(count, callback) {
			var url = "backend/getRandomPuzzles.php?count=" + count;
			fetchPuzzles(url, callback);
		}
	};
	
	
	/**
	 * @param {String} url
	 * @param {function(Array<Puzzle>)} callback
	 */
	function fetchPuzzles(url, callback) {
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (req.readyState === 4 && req.status === 200) {
				callback(parsePuzzles(req.responseText));
			}
		};
		req.open("GET", url, true);
		req.send();
	}
	
	/**
	 * @param {String} json
	 * @return {Array<Puzzle>}
	 */
	function parsePuzzles(json) {
		var puzzles = [];
		var jsonPuzzles = JSON.parse(json);
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
