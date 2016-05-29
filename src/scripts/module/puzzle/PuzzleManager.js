/**
 * Functions for managing puzzles, including fetching them from the backend
 *
 * @author jakemarsden
 */
define([
	"./Option",
	"./PuzzleDecoder",
	"util/Config"
], function(Option, PuzzleDecoder, Config) {
	
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
});
