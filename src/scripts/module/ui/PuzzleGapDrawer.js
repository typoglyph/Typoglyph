/**
 * Used to generate a visual representation of a puzzle gap
 * 
 * @author jakemarsden
 */
define(["util/Objects", "./Drawer"], function(Objects, Drawer) {
	return Objects.subclass(Drawer, {
		/**
		 * @param {PuzzleOptionDrawer} optionDrawer
		 * @param {boolean} showSolution True if you want the solution to be shown, false if you want
		 *     the current choice to be shown
		 * @constructor
		 */
		create: function(optionDrawer, showSolution) {
			var self = Drawer.create.call(this);
			self.optionDrawer = optionDrawer;
			self.showSolution = showSolution;
			return self;
		},
		
		/**
		 * @param {puzzle/Gap} gap
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(gap) {
			var e = this.newElement("span", "puzzleGap-" + gap.id, "puzzleGap");
			e.setAttribute("data-id", gap.id);
			return e;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {puzzle/Gap} gap
		 * @override
		 */
		drawInto: function(p, gap) {
			var option = (this.showSolution) ? gap.solution : gap.currentChoice;
			if (option !== null) {
				var drawnOption = this.optionDrawer.draw(option);
				p.appendChild(drawnOption);
			}
		}
	});
});
