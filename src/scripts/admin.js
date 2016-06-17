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


    /**
     * Called when the browser has finished (re)loading the document
     */
    (function () {
        editorController = PuzzleEditorController.create(document.querySelector(".content#puzzleEditor"));
        selectorController = PuzzleSelectorController.create(document.querySelector(".content#puzzleSelector"));
        importExportController = ImportExportPuzzlesController.create(document.querySelector(".content#importExport"));
        masterController = MasterController.create([selectorController, editorController, importExportController]);

        showPuzzleSelector();
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
        fetchPuzzles(function(puzzles) {
            selectorController.setOnPuzzleSelectedListener(onPuzzleSelected);
            selectorController.showPuzzlesForSelection(puzzles);
            masterController.show(selectorController);
        });
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
        /**
         * Called when the user has imported some puzzles
         */
        function onPuzzlesImported() {
            // Refresh the "export" bit to reflect the newly imported puzzles
            // Also clears out the "import" bit
            showImportExportTab();
        }

        fetchPuzzles(function(puzzles) {
            importExportController.setOnPuzzlesImportedListener(onPuzzlesImported);
            importExportController.showPuzzles(puzzles);
            masterController.show(importExportController);
        });
    }

    /**
     * Puzzles are reloaded from the backend every single time just to make sure we always have the
     * latest changes. What if someone else's updating at the same time?
     *
     * @param {function(Array<puzzle/Puzzle>)} callback
     */
    function fetchPuzzles(callback) {
        PuzzleManager.fetchAllPuzzles(function (fetchedPuzzles) {
            var puzzles = fetchedPuzzles;
            puzzles.sort(alphabeticalPuzzleComparator);
            callback(puzzles);
        });
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
