/**
 * Used to generate a visual representation of a list of puzzle options
 * 
 * @author jakemarsden
 */
define(["util/Objects", "./Drawer"], function(Objects, Drawer) {
	return Objects.subclass(Drawer, {
		/**
		 * @param {PuzzleOptionDrawer} optionDrawer
		 * @constructor
		 */
		create: function(optionDrawer) {
			var self = Drawer.create.call(this);
			self.optionDrawer = optionDrawer;
			return self;
		},
		
		/**
		 * @param {Array<Option>} obj
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(obj) {
			var msg = "This class only supports the 'drawInto' method";
			throw "UnsupportedOperationException: " + msg;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {Array<Option>} options
		 * @override
		 */
		drawInto: function(p, options) {
			for (var i = 0; i < options.length; i++) {
				var drawnOption = this.optionDrawer.draw(options[i]);
				p.appendChild(drawnOption);
			}
		}
	});
});
