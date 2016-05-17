require([
	"howler",
	"controller/CompletionContentController",
	"controller/MasterController",
	"controller/PuzzleContentController",
	"controller/ResultsContentController",
	"puzzle/PuzzleManager",
	"stats/StatisticsTracker",
	"ui/CompletionGraphicDrawer",
	"ui/CompletionSoundPlayer",
	"ui/ProgressBarDrawer",
	"ui/ToggleButtonDrawer",
	"util/Config",
	"util/Utils",
], function(Howler, CompletionContentController, MasterController, PuzzleContentController,
		ResultsContentController, PuzzleManager, StatisticsTracker, CompletionGraphicDrawer,
		CompletionSoundPlayer, ProgressBarDrawer, ToggleButtonDrawer, Config, Utils) {
	
	
	// Constant variables
	/**
	 * How many puzzles should be in each set
	 */
	var PUZZLE_SET_SIZE = 5;
	/**
	 * How long to display the answer page between each puzzle for, in milliseconds
	 */
	var PUZZLE_RESULT_DISPLAY_TIME = 5000;
	/**
	 * How long to display the completion graphic for, in milliseconds
	 */
	var COMPLETION_GRAPHIC_DISPLAY_TIME = 600;
	
	var BUTTON_AUDIO_MUTE = "images/button_audio_disable.svg";
	var BUTTON_AUDIO_UNMUTE = "images/button_audio_enable.svg";
	
	var BACKEND_BASE_URL = Config.getBackendBaseUrl();
	
	
	// Global variables
	var _puzzleSet = null;
	var _currentPuzzleIndex = null;
	var _statistics = StatisticsTracker.create();
	var _progressBarDrawer = null;
	var _muteButtonDrawer = null;
	var _completionGraphicDrawer = null;
	var _completionSoundPlayer = null;
	
	var _masterController = null;
	var _puzzleController = null;
	var _completionController = null;
	var _resultsController = null;
	
	
	// Event handlers
	/**
	 * Called when the browser has finished (re)loading the document
	 */
	(function() {
		console.info("onLoad");
		
		_masterController = MasterController.create([
			_puzzleController = PuzzleContentController.create(document.getElementById("puzzleContent")),
			_completionController = CompletionContentController.create(document.getElementById("completionContent")),
			_resultsController = ResultsContentController.create(document.getElementById("resultsContent"))
		]);
		
		// Muted when the button is "on" (when muted, display the button to unmute)
		_muteButtonDrawer = ToggleButtonDrawer.create(BUTTON_AUDIO_UNMUTE, BUTTON_AUDIO_MUTE);
		_muteButtonDrawer.setOnStateChangeListener(function(oldValue, newValue) {
			console.debug("mute-button.onStateChange: old=" + oldValue + ", new=" + newValue);
			
			var muteButton = document.getElementById("muteButton");
			_muteButtonDrawer.drawInto(muteButton);
			if (newValue) {
				Howler.Howler.mute();
			} else {
				Howler.Howler.unmute();
			}
		});
		_muteButtonDrawer.setEnabled(false);
		
		fetchCompletionGraphics(null, true, function(graphics) {
			fetchCompletionSounds(null, true, function(sounds) {
				_completionGraphicDrawer = CompletionGraphicDrawer.create(graphics[0], graphics[1]);
				_completionSoundPlayer = CompletionSoundPlayer.create(sounds[0], sounds[1]);
				startNewPuzzleSet();
			});
		});
	})();
	
	document.getElementById("muteButton").addEventListener("click", function(event) {
		console.debug("onMuteButtonClicked: event=" + event);
		_muteButtonDrawer.toggle(); // Also triggers the event listener setup in onLoad()
	});
	
	
	/**
	 * Loads and starts a new set of puzzles for the user to solve
	 */
	function startNewPuzzleSet() {
		console.info("startNewPuzzleSet");
		PuzzleManager.fetchRandomPuzzles(PUZZLE_SET_SIZE, function(puzzles) {
			console.debug("startNewPuzzleSet.onPuzzlesLoaded: " + puzzles);
			_progressBarDrawer = ProgressBarDrawer.create(puzzles.length);
			_puzzleSet = puzzles;
			_currentPuzzleIndex = 0;
			_statistics.reset();
			
			renderCurrentPuzzle(onPuzzleComplete);
			renderStatistics();
		});
	}
	
	/**
	 * @param {MouseEvent} event Information about the event which completed the puzzle
	 * @param {Puzzle} puzzle
	 * @param {boolean} correct
	 */
	function onPuzzleComplete(event, puzzle, correct) {
		console.info("onPuzzleComplete: event=" + event + ", puzzle=" + puzzle + ", correct=" + correct);
		
		_statistics.onPuzzleAnswered(puzzle, correct);
		_currentPuzzleIndex++;
		
		renderStatistics();
		renderPuzzleResult(
			function() {
				// Move on to the next puzzle
				if (_currentPuzzleIndex < _puzzleSet.length) {
					// Not all puzzles have yet been completed
					renderCurrentPuzzle(onPuzzleComplete);
				} else {
					// All puzzles have been completed
					// Load the results page
					renderPuzzleSetResults(function() { startNewPuzzleSet(); });
				}
			});
	}
	
	
	// Rendering functions
	/**
	 * Updates sections of the UI which show how far the user is through the puzzle set, etc.
	 */
	function renderStatistics() {
		console.debug("renderStatistics");
		
		var progressBar = document.getElementById("progressBar");
		Utils.removeAllChildren(progressBar);
		_progressBarDrawer.drawInto(progressBar, _statistics);
	}
	
	/**
	 * Update the UI to (re)draw the puzzle currently being solved
	 * 
	 * @param {function(Puzzle, boolean)} onPuzzleCompleteListener The listener to call once the
	 *     user has completed the given puzzle
	 */
	function renderCurrentPuzzle(onPuzzleCompleteListener) {
		console.debug("renderCurrentPuzzle");
		
		_puzzleController.setOnPuzzleCompleteListener(onPuzzleCompleteListener);
		_puzzleController.showPuzzle(_puzzleSet[_currentPuzzleIndex]);
		_masterController.show(_puzzleController);
	}
	
	/**
	 * Show the completion graphic and the puzzle result page for a specified amount of time
	 * 
	 * @param {function()} onFinishListener The listener to call once the results page has finished
	 *     been shown
	 */
	function renderPuzzleResult(onFinishListener) {
		console.debug("renderPuzzleResult");
		
		// Get ready to show the completion graphic
		var completionGraphic = document.getElementById("completionGraphic");
		var result = _statistics.getLatestStatistic().result;

		// Show the results page
		var finishTimeout = setTimeout(onFinishListener, PUZZLE_RESULT_DISPLAY_TIME);
		_completionController.setOnSkipListener(function() {
			clearTimeout(finishTimeout);
			onFinishListener();
		});
		_completionController.showResults(_statistics);
		_masterController.show(_completionController);
		
		// Show the completion graphic for a time
		_completionGraphicDrawer.drawInto(completionGraphic, result);
		_completionSoundPlayer.playSound(result);
		setTimeout(
			function() { _completionGraphicDrawer.reset(completionGraphic); },
			COMPLETION_GRAPHIC_DISPLAY_TIME);
	}
	
	/**
	 * At the end of each full set of puzzles, show the set result page and then move on to the
	 * next set
	 * 
	 * @param {function()} onFinishListener The function to execute when the results page has
	 *     finsished being shown
	 */
	function renderPuzzleSetResults(onFinishListener) {
		console.debug("renderPuzzleSetResults");
		
		_resultsController.setOnNextPuzzleSetListener(onFinishListener);
		_resultsController.showResults(_statistics);
		_masterController.show(_resultsController)
	}
	
	
	// Functions which call the backend
	/**
	 * @param {boolean} correct True if you want to fetch graphics representing a correct answer or
	 *     false if you want to fetch graphics representing an incorrect answer or null if you want
	 *     to fetch all graphics
	 * @param {boolean} async True if you want the graphics to be fetched asynchronously
	 * @param {function(Array<Array<String>>)} callback The function to call when the graphics have
	 *     been fetched. It will be passed an array where index 0 holds an array of correct
	 *     graphics and index 1 holds an array of incorrect graphics (although one of the arrays
	 *     may be empty, depending on what you pass for the "correct" parameter)
	 */
	function fetchCompletionGraphics(correct, async, callback) {
		var which;
		switch (correct) {
			case null:
				which = "both";
				break;
			case true:
				which = "correct";
				break;
			case false:
				which = "incorrect";
				break;
			default:
				throw "IllegalArgumentException: correct=" + correct;
		}
		
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (req.readyState === 4 && req.status === 200) {
				var resp = req.responseText;
				var result = JSON.parse(resp);
				var graphics = [result["correct"], result["incorrect"]];
				callback(graphics);
			}
		}
		req.open("GET", BACKEND_BASE_URL + "getCompletionGraphics.php?which=" + which, async);
		req.send();
	}
	
	/**
	 * @param {boolean} correct True if you want to fetch sounds representing a correct answer or
	 *     false if you want to fetch sounds representing an incorrect answer or null if you want
	 *     to fetch all sounds
	 * @param {boolean} async True if you want the request to be executed asynchronously
	 * @param {function(Array<Array<String>>)} callback The function which will be called when the
	 *     sounds have been fetched. It will be passed an array where index 0 holds an array of
	 *     correct sounds and index 1 holds an array of incorrect sounds (although one of the
	 *     arrays may be empty, depending on what you pass for the "correct" parameter)
	 */
	function fetchCompletionSounds(correct, async, callback) {
		var which;
		switch (correct) {
			case null:
				which = "both";
				break;
			case true:
				which = "correct";
				break;
			case false:
				which = "incorrect";
				break;
			default:
				throw "IllegalArgumentException: correct=" + correct;
		}
		
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (req.readyState === 4 && req.status === 200) {
				var resp = req.responseText;
				var result = JSON.parse(resp);
				var sounds = [result["correct"], result["incorrect"]];
				callback(sounds);
			}
		}
		req.open("GET", BACKEND_BASE_URL + "getCompletionSounds.php?which=" + which, async);
		req.send();
	}
});
