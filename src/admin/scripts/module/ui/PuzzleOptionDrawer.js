/**
 * Used to generate a visual representation of a puzzle option
 * 
 * @author jakemarsden
 */
define(["util/Objects", "./Drawer"], function(Objects, Drawer) {
	return Objects.subclass(Drawer, {
		/**
		 * @constructor
		 */
		create: function() {
			return Drawer.create.call(this);
		},
		
		/**
		 * @param {puzzle/Option} option
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(option) {
			var e = this.newElement("span", "puzzleOption-" + option.id, "puzzleOption");
			e.setAttribute("data-id", option.id);
			return e;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {puzzle/Option} option
		 * @override
		 */
		drawInto: function(p, option) {
			p.appendChild(this.newTextNode(option.value));
		}
	});
});
