require([
    "controller/MasterController",
    "controller/ImportExportPuzzlesController",
    "controller/PuzzleEditorController",
    "controller/PuzzleSelectorController",
    "puzzle/PuzzleManager"
], function (MasterController, ImportExportPuzzlesController, PuzzleEditorController,
        PuzzleSelectorController, PuzzleManager) {

    var masterController = null;
    var editorController = null;
    var selectorController = null;
    var importExportController = null;

    var puzzles = null;


    /**
     * Called when the browser has finished (re)loading the document
     */
    (function () {
        editorController = PuzzleEditorController.create(document.querySelector(".content#puzzleEditor"));
        selectorController = PuzzleSelectorController.create(document.querySelector(".content#puzzleSelector"));
        importExportController = ImportExportPuzzlesController.create(document.querySelector(".content#importExport"));
        masterController = MasterController.create([selectorController, editorController, importExportController]);

        PuzzleManager.fetchAllPuzzles(function (fetchedPuzzles) {
            puzzles = fetchedPuzzles;
            puzzles.sort(alphabeticalPuzzleComparator);
            showPuzzleSelector();
        });
        PuzzleManager.getDefaultGlobalOptions(function (options) {
            editorController.setGlobalOptions(options);
        });

        document.querySelector("button#editBtn").addEventListener("click", function (event) {
            console.debug("[button#editBtn].click: event=" + event);
            showPuzzleSelector();
        });
        document.querySelector("button#importExportBtn").addEventListener("click", function(event) {
            console.debug("[button#importExportBtn].click: event=" + event);
            showImportExportTab();
        });
    })();
    
    
    function showPuzzleSelector() {
		/**
		 * Called when the user selects a puzzle
		 * 
		 * @param {puzzle/Puzzle} puzzle The selected puzzle
		 */
		function onPuzzleSelected(puzzle) {
			console.debug("onPuzzleSelected: puzzle=" + puzzle);
			showPuzzleEditor(puzzle);
		}
		selectorController.setOnPuzzleSelectedListener(onPuzzleSelected);
        selectorController.showPuzzlesForSelection(puzzles);
        masterController.show(selectorController);
    }

    /**
     * @param {puzzle/Puzzle} puzzle
     */
    function showPuzzleEditor(puzzle) {
        /**
         * Called when the user wants to navigate back to the puzzle selection menu
         */
        function onNavigateBack() {
            console.debug("onNavigateBack");
            showPuzzleSelector();
        }

        editorController.setOnNavigateBackListener(onNavigateBack);
        editorController.showPuzzleForEditing(puzzle);
        masterController.show(editorController);
    }

    function showImportExportTab() {
        importExportController.showPuzzles(puzzles);
        masterController.show(importExportController);
    }

    /**
     * Used for sorting an array of puzzles alphabetically by sentence
     *
     * @param {puzzle/Puzzle} puzzleA
     * @param {puzzle/Puzzle} puzzleB
     * @return {int}
     */
    function alphabeticalPuzzleComparator(puzzleA, puzzleB) {
        var charsA = puzzleA.listSentenceCharacters();
        var charsB = puzzleB.listSentenceCharacters();
        for (var i = 0; i < Math.min(charsA.length, charsB.length); i++) {
            var valueA = charsA[i].value.toLowerCase();
            var valueB = charsB[i].value.toLowerCase();
            var cmp = valueA.localeCompare(valueB);
            if (cmp !== 0) {
                return cmp;
            }
        }
        // Rank the shorter sentence first
        return charsB.length - charsA.length;
    }
});
