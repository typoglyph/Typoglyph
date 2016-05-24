require([
	"controller/MasterController",
	"controller/PuzzleEditorController",
	"controller/PuzzleSelectorController",
	"puzzle/PuzzleManager",
	"util/Utils"
], function(MasterController, PuzzleEditorController, PuzzleSelectorController, PuzzleManager,
		Utils) {
	
	var masterController = null;
	var editorController = null;
	var selectorController = null;
	
	
	/**
	 * Called when the browser has finished (re)loading the document
	 */
	(function() {
		editorController = PuzzleEditorController.create(document.getElementById("puzzleEditor"));
		selectorController = PuzzleSelectorController.create(document.getElementById("puzzleSelector"));
		masterController = MasterController.create([selectorController, editorController]);
		
		PuzzleManager.fetchAllPuzzles(function(puzzles) {
			puzzles.sort(alphabeticalPuzzleComparator);
			showPuzzleSelector(puzzles);
		});
		PuzzleManager.getDefaultGlobalOptions(function(options) {
			editorController.setGlobalOptions(options);
		});
	})();
	
	
	/**
	 * @param {Array<puzzle/Puzzle>} puzzles
	 */
	function showPuzzleSelector(puzzles) {
		/**
		 * Called when the user selects a puzzle
		 * 
		 * @param {puzzle/Puzzle} puzzle The selected puzzle
		 */
		function onPuzzleSelected(puzzle) {
			console.debug("onPuzzleSelected: puzzle=" + puzzle);
			showPuzzleEditor(puzzle, puzzles);
		}
		selectorController.setOnPuzzleSelectedListener(onPuzzleSelected);
		selectorController.showPuzzlesForSelection(puzzles);
		masterController.show(selectorController);
	}
	
	/**
	 * @param {puzzle/Puzzle} puzzle
	 * @param {Array<puzzle/Puzzle>} allPuzzles
	 */
	function showPuzzleEditor(puzzle, allPuzzles) {
		/**
		 * Called when the user wants to navigate back to the puzzle selection menu
		 */
		function onNavigateBack() {
			console.debug("onNavigateBack");
			showPuzzleSelector(allPuzzles);
		}
		editorController.setOnNavigateBackListener(onNavigateBack);
		editorController.showPuzzleForEditing(puzzle);
		masterController.show(editorController);
	}
	
	/**
	 * Used for sorting an array of puzzles alphabetically by sentence
	 * 
	 * @param {puzzle/Puzzle} puzzleA
	 * @param {puzzle/Puzzle} puzzleB
	 * @return {int}
	 */
	function alphabeticalPuzzleComparator(puzzleA, puzzleB) {
		var a = puzzleA.sentence.toLowerCase();
		var b = puzzleB.sentence.toLowerCase();
		return a.localeCompare(b);
	}
});
