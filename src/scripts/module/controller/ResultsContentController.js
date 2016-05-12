/**
 * @author jakemarsden
 */
define(["util/Objects", "./ContentController"], function(Objects, ContentController) {
	return Objects.subclass(ContentController, {
		/**
		 * @constructor
		 */
		create: function(e) {
			var self = ContentController.create.call(this, e);
			self.nextPuzzleSetListener = null;
			return self;
		},
		
		/**
		 * @param {stats/StatisticsTracker} statsTracker
		 */
		showResults: function(statsTracker) {
			var allStats = statsTracker.getStatistics();
			var correctStats = statsTracker.getCorrectlyAnsweredStatistics();
			this.element.querySelector("#correct").innerHTML = correctStats.length;
			this.element.querySelector("#total").innerHTML = allStats.length;
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
		}
	});
});
