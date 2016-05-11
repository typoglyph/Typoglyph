require([
	"jquery",
	"puzzle/PuzzleManager",
	"ui/PuzzleDrawer", "ui/PuzzleGapDrawer", "ui/PuzzleOptionBarDrawer", "ui/PuzzleOptionDrawer"
], function(unused, PuzzleManager, PuzzleDrawer, PuzzleGapDrawer, PuzzleOptionBarDrawer, PuzzleOptionDrawer) {
	
	
	var table = document.getElementById("puzzles");
	
	var optionDrawer = PuzzleOptionDrawer.create();
	var optionBarDrawer = PuzzleOptionBarDrawer.create(optionDrawer);
	var puzzleDrawer = PuzzleDrawer.create(PuzzleGapDrawer.create(optionDrawer, true));
	
	
	
	PuzzleManager.fetchAllPuzzles(function(puzzles) {
		for (var i = 0; i < puzzles.length; i++) {
			puzzles.sort(alphabeticalPuzzleComparator);
			drawPuzzleIntoTable(puzzles[i], table);
		}
	});
	
	
	/**
	 * Draw the given puzzle into the table as a new row
	 * 
	 * @param {puzzle/Puzzle} puzzle
	 * @param {HTMLTableElement} table
	 */
	function drawPuzzleIntoTable(puzzle, table) {
		var puzzleTd = document.createElement("td");
		var puzzleDiv = document.createElement("div");
		puzzleDrawer.drawInto(puzzleDiv, puzzle);
		puzzleDiv.className = "puzzleSentence";
		puzzleTd.appendChild(puzzleDiv);
		
		var optionsTd = document.createElement("td");
		var optionsDiv = document.createElement("div");
		optionBarDrawer.drawInto(optionsDiv, puzzle.options);
		optionsDiv.className = "puzzleOptions";
		optionsTd.appendChild(optionsDiv);
		
		var tr = document.createElement("tr");
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
