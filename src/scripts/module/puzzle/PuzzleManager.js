/**
 * Functions for managing puzzles, including fetching them from the backend
 *
 * @author jakemarsden
 */
define([
	"./Option",
	"./PuzzleDecoder",
	"./PuzzleEncoder",
	"util/Config"
], function(Option, PuzzleDecoder, PuzzleEncoder, Config) {
	
	var BACKEND_BASE_URL = Config.getBackendBaseUrl();
	return {
		/**
		 * Global options only have meaning on the admin page. They are the options which can be
		 * used to build puzzles. Custom global options can be added by the user, but these aren't
		 * currently persisted.
		 * 
		 * @param {function(Array<puzzle/Option>)} callback
		 */
		getDefaultGlobalOptions: function(callback) {
			var options = [
				Option.create("."),
				Option.create(","),
				Option.create("'"),
				Option.create("?"),
				Option.create("!")
			];
			callback(options);
		},
		
		
		/**
		 * @param {function(Array<puzzle/Puzzle>)} callback The function to call on success
		 */
		fetchAllPuzzles: function(callback) {
			var url = BACKEND_BASE_URL + "getAllPuzzles.php";
			fetchPuzzles(url, callback)
		},
		
		/**
		 * @param {int} count How many puzzles to fetch
		 * @param {function(Array<puzzle/Puzzle>)} callback The function to call on success
		 */
		fetchRandomPuzzles: function(count, callback) {
			var url = BACKEND_BASE_URL + "getRandomPuzzles.php?count=" + count;
			fetchPuzzles(url, callback);
		},

		/**
		 * @param {Array<Puzzle>} puzzles
		 * @param {String} mode Either "merge", "insert" or "replace"
		 * @param {function()} callback
		 */
		updatePuzzles: function(puzzles, mode, callback) {
			if (mode !== "merge" && mode !== "insert" && mode !== "replace") {
				throw new Error("Unknown mode: " +  mode);
			}
			var url = BACKEND_BASE_URL + "updatePuzzles.php?mode=" + mode;
			putPuzzles(url, puzzles, callback);
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
				var puzzles = PuzzleDecoder.fromJsonArray(req.responseText);
				callback(puzzles);
			}
		};
		req.open("GET", url, true);
		req.send();
	}

	/**
	 * @param {String} url
	 * @param {Array<Puzzle>} puzzles
	 * @param {function()} callback
	 */
	function putPuzzles(url, puzzles, callback) {
		var data = PuzzleEncoder.toJsonArray(puzzles);
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (req.readyState === 4 && req.status === 200) {
				callback();
			}
		};
		req.open("POST", url, true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send("data=" + encodeURIComponent(data));
	}
});
