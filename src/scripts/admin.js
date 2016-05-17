require([
	"puzzle/PuzzleManager",
	"ui/PuzzleDrawer", "ui/PuzzleGapDrawer", "ui/PuzzleOptionBarDrawer", "ui/PuzzleOptionDrawer",
	"util/Utils"
], function(PuzzleManager, PuzzleDrawer, PuzzleGapDrawer, PuzzleOptionBarDrawer, PuzzleOptionDrawer, Utils) {
		
	var optionDrawer = PuzzleOptionDrawer.create();
	var optionBarDrawer = PuzzleOptionBarDrawer.create(optionDrawer);
	var puzzleDrawer = PuzzleDrawer.create(PuzzleGapDrawer.create(optionDrawer, true));
	
	var puzzles = null;
	var currentPuzzle = null;
	
	
	PuzzleManager.fetchAllPuzzles(function(ps) {
		puzzles = ps;
		puzzles.sort(alphabeticalPuzzleComparator);
	
		document.getElementById("menuButton").addEventListener("click", function(event) {
			console.debug("onclick: event=" + event);
			currentPuzzle = null;
			refreshDisplayedPuzzle();
		});
		refreshDisplayedPuzzle();
	});
	
	
	function refreshDisplayedPuzzle() {
		// DOM manipulation is much easier if we temperarily remove header
		var table = document.getElementById("puzzles");
		var headerRow = table.rows[0];
		Utils.removeAllChildren(table);
		
		if (currentPuzzle === null) {
			// Let user choose a puzzle
			for (var i = 0; i < puzzles.length; i++) {
				drawPuzzleIntoTable(puzzles[i], table);
			}
			for (var i = 0; i < table.childNodes.length; i++) {
				(function(index) {
					var tr = table.childNodes[i];
					tr.addEventListener("click", function(event) {
						console.debug("onclick: event=" + event);
						currentPuzzle = index;
						refreshDisplayedPuzzle();
					});
				})(i);
			}
		} else {
			drawPuzzleIntoTable(puzzles[currentPuzzle], table);
		}
		
		// Replace table header
		table.insertBefore(headerRow, table.firstChild);
	}
	
	/**
	 * Draw the given puzzle into the table as a new row
	 * 
	 * @param {puzzle/Puzzle} puzzle
	 * @param {HTMLTableElement} table
	 */
	function drawPuzzleIntoTable(puzzle, table) {
		var idTd = document.createElement("td");
		idTd.innerHTML = puzzle.id;
		idTd.className = "puzzleId";
		
		var puzzleTd = document.createElement("td");
		puzzleDrawer.drawInto(puzzleTd, puzzle);
		puzzleTd.className = "puzzleSentence"
		
		var optionsTd = document.createElement("td");
		optionBarDrawer.drawInto(optionsTd, puzzle.options);
		optionsTd.className = "puzzleOptions";
		
		var tr = document.createElement("tr");
		tr.appendChild(idTd);
		tr.appendChild(puzzleTd);
		tr.appendChild(optionsTd);
		table.appendChild(tr);
	}
	
	/**
	 * Useful when you want to sort an array of puzzles alphabetically by their sentences
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
