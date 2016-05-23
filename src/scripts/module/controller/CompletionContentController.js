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
			self.skipListener = null;
			return self;
		},
		
		/**
		 * Displays the given statistics for the user
		 * 
		 * @param {stats/StatisticsTracker} statsTracker
		 */
		showResults: function(statsTracker) {
			var latestStat = statsTracker.getLatestStatistic();
			var resultElement = this.element.querySelector("#result");
			resultElement.innerHTML = (latestStat.result) ? "correct" : "incorrect";
			Utils.addClass(resultElement, latestStat.result ? "correct" : "incorrect");
			
			var puzzleElement = this.element.querySelector("#puzzleAnswer");
			this.puzzleDrawer.drawInto(puzzleElement, latestStat.puzzle);
		},
		
		/**
		 * Sets up a listener to be called when the user decides to skip past the completion page. Pass
		 * null to remove any current listener.
		 * 
		 * @param {function()} listener
		 */
		setOnSkipListener: function(listener) {
			this.skipListener = listener;
		},
		
		/**
		 * @override
		 */
		onInit: function() {
			var self = this;
			self.element.addEventListener("click", function(event) {
				if (self.skipListener !== null) {
					self.skipListener();
				}
			});
		},
		
		/**
		 * @override
		 */
		onDestroy: function() {
			var resultElement = this.element.querySelector("#result");
			Utils.removeAllChildren(resultElement);
			Utils.removeClass(resultElement, "correct");
			Utils.removeClass(resultElement, "incorrect");
			Utils.removeAllChildren(this.element.querySelector("#puzzleAnswer"));
		}
	});
});
