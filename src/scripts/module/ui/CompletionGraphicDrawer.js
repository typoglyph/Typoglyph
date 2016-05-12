/**
 * @author jakemarsden
 */
define(["util/Objects", "util/Utils", "./Drawer"], function(Objects, Utils, Drawer) {
	return Objects.subclass(Drawer, {
		/**
		 * @param {Array<String>} correctGraphics
		 * @param {Array<String>} incorrectGraphics
		 * @constructor
		 */
		create: function(correctGraphics, incorrectGraphics) {
			var self = Drawer.create.call(this);
			self.correctGraphics = correctGraphics;
			self.incorrectGraphics = incorrectGraphics;
			return self;
		},
		
		/**
		 * @param {boolean} obj
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(obj) {
			var msg = "This class only supports the 'drawInto' method";
			throw "UnsupportedOperationException: " + msg;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {boolean} correct
		 * @override
		 */
		drawInto: function(p, correct) {
			/*
			Problem: When setting both "transform:rotate()" in an element's style and
				"transform:translate()" in its CSS rule, one transformation will override the other and
				only the rotation will actually be used. Example:
				<style>#test { transform:translate(); }</style>
				<div id="test" style="transform:rotate();" />
			Solution:
				Wrap the element in a <div>. Apply the translation to the <div> and the rotation to the
				element. Example:
				<style>#test { transform:translate(); }</style>
				<div style="transform:rotate();"><div id="test"></div>
			*/
			var graphic = Utils.randomElement(correct ? this.correctGraphics : this.incorrectGraphics);
			var inner = this.newElement("img");		
			inner.src = graphic;
			Utils.setImageRotation(inner, Utils.randomInt(-50, 50));
			p.appendChild(inner);
		},
		
		/**
		 * Returns the given DOM element to its default state. This is usually called sometime after a
		 * call to "drawInto(p, ?)"
		 * 
		 * @param {HTMLElement} p
		 */
		reset: function(p) {
			Utils.removeAllChildren(p);
		}
	});
});
