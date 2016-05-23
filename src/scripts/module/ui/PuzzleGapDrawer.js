/**
 * Used to generate a visual representation of a puzzle gap
 * 
 * @author jakemarsden
 */
define(["util/Objects", "./Drawer"], function(Objects, Drawer) {
	
	return Objects.subclass(Drawer, {
		/**
		 * @param {PuzzleOptionDrawer} optionDrawer
		 * @param {boolean} [optional] True if you want empty gaps to be shown or false if they
		 *     should be replaced with spaces. Defaults to true.
		 * @constructor
		 */
		create: function(optionDrawer) {
			var showEmptyGaps = (arguments.length >= 2 && arguments[1] !== null) ? arguments[1] : true;
			var self = Drawer.create.call(this);
			self.optionDrawer = optionDrawer;
			self.showEmptyGaps = showEmptyGaps;
			return self;
		},
		
		/**
		 * @param {puzzle/Gap} gap
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(gap) {
			var e;
			if (this.showEmptyGaps || this.getOptionToDraw(gap) !== null) {
				e = this.newElement("span", "puzzleGap-" + gap.id, "puzzleGap");
				e.setAttribute("data-id", gap.id);
			} else {
				e = this.newTextNode(" ");
			}
			return e;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {puzzle/Gap} gap
		 * @override
		 */
		drawInto: function(p, gap) {
			var option = this.getOptionToDraw(gap);
			if (option !== null) {
				var drawnOption = this.optionDrawer.draw(option);
				p.appendChild(drawnOption);
			}
		},
		
		/**
		 * Provided for subclasses to override if required
		 * 
		 * @param {puzzle/Gap} gap The gap which is being drawn
		 * @return {puzzle/Option} option The option which should be drawn into this gap, or null
		 *     if no option is to be drawn
		 */
		getOptionToDraw: function(gap) {
			return gap.currentChoice;
		}
	});
});
