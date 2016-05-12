/**
 * @author jakemarsden
 */
define(["util/Objects", "./Drawer"], function(Objects, Drawer) {
	return Objects.subclass(Drawer, {
		/**
		 * @param {int} setSize How many puzzles to expect in each set of puzzles
		 * @constructor
		 */
		create: function(setSize) {
			var self = Drawer.create.call(this);
			self.setSize = setSize;
			return self;
		},
		
		/**
		 * @param {stats/StatisticsTracker} obj
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(obj) {
			var msg = "This class only supports the 'drawInto' method";
			throw "UnsupportedOperationException: " + msg;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {stats/StatisticsTracker} statsTracker Information about puzzles which have been answered so far
		 * @override
		 */
		drawInto: function(p, statsTracker) {
			var stats = statsTracker.getStatistics();
			for (var i = 0; i < stats.length; i++) {
				var progress = this.newElement("span", "", (stats[i].result ? "correct" : "incorrect"));
				progress.style.width = (100 / this.setSize) + "%";
				p.appendChild(progress);
			}
		}
	});
});
