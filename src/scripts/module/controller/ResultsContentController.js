/**
 * @author jakemarsden
 */
define([
	"ui/PuzzleDrawer",
	"ui/PuzzleOptionDrawer",
	"ui/SolutionShowingPuzzleGapDrawer",
	"util/Objects",
	"util/Utils",
	"./ContentController"
], function(PuzzleDrawer, PuzzleOptionDrawer, SolutionShowingPuzzleGapDrawer, Objects, Utils,
		ContentController) {
	
	return Objects.subclass(ContentController, {
		/**
		 * @constructor
		 */
		create: function(e) {
			var self = ContentController.create.call(this, e);
			self.puzzleDrawer = PuzzleDrawer.create(
					SolutionShowingPuzzleGapDrawer.create(PuzzleOptionDrawer.create(), false));
			self.nextPuzzleSetListener = null;
			return self;
		},
		
		/**
		 * @param {stats/StatisticsTracker} statsTracker
		 */
		showResults: function(statsTracker) {			
			var stats = statsTracker.getStatistics();
			
			var correctList = this.element.querySelector("#correctPuzzlesList");
			var incorrectList = this.element.querySelector("#incorrectPuzzlesList");
			for (var i = (stats.length - 1); i >= 0; i--) {
				var puzzleElement = document.createElement("li");
				this.puzzleDrawer.drawInto(puzzleElement, stats[i].puzzle);
				(stats[i].result ? correctList : incorrectList).appendChild(puzzleElement);
			}
			
			this.element.querySelector("#correctlyAnsweredCount").innerHTML = correctList.childNodes.length;
			this.element.querySelector("#totalAnsweredCount").innerHTML = stats.length;
			
			// Hide a section if it doesn't contain any puzzles
			if (correctList.childNodes.length === 0) {
				this.element.querySelector("#correctPuzzles").style.display = "none";
			}
			if (incorrectList.childNodes.length === 0) {
				this.element.querySelector("#incorrectPuzzles").style.display = "none";
			}
		},
		
		/**
		 * @param {function()} listener Or null to remove the current listener
		 */
		setOnNextPuzzleSetListener: function(listener) {
			this.nextPuzzleSetListener = listener;
		},
		
		/**
		 * @override
		 */
		onInit: function() {
			var self = this;
			self.element.querySelector("#nextPuzzleSet.button").addEventListener("click", function(event) {
				if (self.nextPuzzleSetListener !== null) {
					self.nextPuzzleSetListener();
				}
			});
		},
		
		/**
		 * @override
		 */
		onDestroy: function() {
			Utils.removeAllChildren(this.element.querySelector("#correctPuzzlesList"));
			Utils.removeAllChildren(this.element.querySelector("#incorrectPuzzlesList"));
			this.element.querySelector("#correctlyAnsweredCount").innerHTML = "";
			this.element.querySelector("#totalAnsweredCount").innerHTML = "";
			this.element.querySelector("#correctPuzzles").style.display = "initial";
			this.element.querySelector("#incorrectPuzzles").style.display = "initial";
		}
	});
});
