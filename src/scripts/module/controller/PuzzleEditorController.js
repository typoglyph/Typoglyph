/**
 * @author jakemarsden
 */
define([
	"ui/PuzzleDrawer",
	"ui/PuzzleGapDrawer",
	"ui/PuzzleOptionBarDrawer",
	"ui/PuzzleOptionDrawer",
	"util/Objects",
	"util/Utils",
	"./ContentController"
], function(PuzzleDrawer, PuzzleGapDrawer, PuzzleOptionBarDrawer, PuzzleOptionDrawer, Objects,
		Utils, ContentController) {
	
	return Objects.subclass(ContentController, {
		/**
		 * @constructor
		 */
		create: function(e) {
			var optionDrawer = PuzzleOptionDrawer.create();
			var self = ContentController.create.call(this, e);
			self.puzzleDrawer = PuzzleDrawer.create(PuzzleGapDrawer.create(optionDrawer, true));
			self.optionsDrawer = PuzzleOptionBarDrawer.create(optionDrawer);
			self.navigateBackListener = null;
			return self;
		},
		
		/**
		 * @param {puzzle/Puzzle} puzzle
		 */
		showPuzzleForEditing: function(puzzle) {
			var idElement = this.element.querySelector("#puzzleId");
			var sentenceElement = this.element.querySelector("#puzzleSentence");
			var optionsElement = this.element.querySelector("#puzzleOptions");
			
			idElement.innerHTML = puzzle.id;
			this.puzzleDrawer.drawInto(sentenceElement, puzzle);
			this.optionsDrawer.drawInto(optionsElement, puzzle);
		},
		
		/**
		 * @param {function()} listener
		 */
		setOnNavigateBackListener: function(listener) {
			this.navigateBackListener = listener;
		},
		
		
		/**
		 * @override
		 */
		onInit: function() {
			var self = this;
			self.element.querySelector("#backButton").addEventListener("click", function(event) {
				if (self.navigateBackListener !== null)
					self.navigateBackListener();
			});
		},
		
		/**
		 * @override
		 */
		onDestroy: function() {
			Utils.removeAllChildren(this.element.querySelector("#puzzleId"));
			Utils.removeAllChildren(this.element.querySelector("#puzzleSentence"));
			Utils.removeAllChildren(this.element.querySelector("#puzzleOptions"));
		}
	});
});
