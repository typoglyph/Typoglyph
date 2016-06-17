/**
 * @author jakemarsden
 */
define([
	"ui/AlwaysCorrectPuzzleGapDrawer",
	"ui/PuzzleDrawer",
	"ui/PuzzleOptionBarDrawer",
	"ui/PuzzleOptionDrawer",
	"util/Objects",
	"util/Utils",
	"./ContentController"
], function(AlwaysCorrectPuzzleGapDrawer, PuzzleDrawer, PuzzleOptionBarDrawer, PuzzleOptionDrawer, Objects,
		Utils, ContentController) {
	
	/**
	 * Draw the given puzzle into the table as a new row, using the given drawers
	 * 
	 * @param {HTMLTableElement} table
	 * @param {puzzle/Puzzle} puzzle
	 * @param {PuzzleDrawer} puzzleDrawer
	 * @param {PuzzleOptionBarDrawer} optionsDrawer
	 * @param {HTMLTableRowElement} The row containing the drawn puzzle
	 */
	function drawPuzzleIntoTableRow(table, puzzle, puzzleDrawer, optionsDrawer) {
		var idTd = document.createElement("td");
		idTd.innerHTML = puzzle.id;
		idTd.className = "puzzleId";
		
		var puzzleTd = document.createElement("td");
		puzzleDrawer.drawInto(puzzleTd, puzzle);
		puzzleTd.className = "puzzleSentence"
		
		var optionsTd = document.createElement("td");
		optionsDrawer.drawInto(optionsTd, puzzle.options);
		optionsTd.className = "puzzleOptions";
		
		var tr = document.createElement("tr");
		tr.appendChild(idTd);
		tr.appendChild(puzzleTd);
		tr.appendChild(optionsTd);
		return tr;
	}
	
	
	return Objects.subclass(ContentController, {
		/**
		 * @constructor
		 */
		create: function(e) {
			var optionDrawer = PuzzleOptionDrawer.create();
			var self = ContentController.create.call(this, e);
			self.puzzleDrawer = PuzzleDrawer.create(AlwaysCorrectPuzzleGapDrawer.create(optionDrawer));
			self.optionsDrawer = PuzzleOptionBarDrawer.create(optionDrawer);
			self.puzzleSelectedListener = null;
			return self;
		},
		
		/**
		 * @param {Array<puzzle/Puzzle>} puzzle
		 */
		showPuzzlesForSelection: function(puzzles) {
			var self = this;
			/**
			 * @param {HTMLElement} e The element to add the listener to
			 * @param {puzzle/Puzzle} puzzle The puzzle associated with the given row
			 */
			function addClickListener(e, puzzle) {
				e.addEventListener("click", function(event) {
					if (self.puzzleSelectedListener !== null)
						self.puzzleSelectedListener(puzzle);
				});
			}
			this.clearShownPuzzles();

			// append each puzzle to the table
			var table = this.element.querySelector("#puzzles");
			for (var i = 0; i < puzzles.length; i++) {
				var row = drawPuzzleIntoTableRow(table, puzzles[i], this.puzzleDrawer, this.optionsDrawer);
				addClickListener(row, puzzles[i]);
				table.appendChild(row);
			}
		},

		clearShownPuzzles: function() {
			// Remove all rows except the header
			var table = this.element.querySelector("#puzzles");
			var headerRow = table.rows[0];
			Utils.removeAllChildren(table);

			// Replace header
			table.insertBefore(headerRow, table.firstChild);
		},
		
		/**
		 * @param {function(puzzle/Puzzle)} listener
		 */
		setOnPuzzleSelectedListener: function(listener) {
			this.puzzleSelectedListener = listener;
		},

		/**
		 * @override
		 */
		onDestroy: function() {
			this.clearShownPuzzles();
		}
	});
});
