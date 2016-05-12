/**
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	return {
		/**
		 * @constructor
		 */
		create: function() {
			var self = Objects.subclass(this);
			return self;
		},
		
		/**
		 * Creates and returns a new DOM element which can act as the root of the drawn element for the
		 * given object.
		 * Important: This method should only ever be called from within the typoglyph.ui.Drawer class.
		 * 
		 * @param {Object} obj
		 * @return {HTMLElement}
		 * @private
		 * @abstract
		 */
		createRootElement: function(obj) {
			throw "NotImplementedException";
		},
		
		/**
		 * Draws the given object into a new DOM element and returns the new DOM element
		 * 
		 * @param {Object} obj The object to draw
		 * @return {HTMLElement} The drawn object
		 */
		draw: function(obj) {
			var rootE = this.createRootElement(obj);
			this.drawInto(rootE, obj);
			return rootE;
		},
		
		/**
		 * Draws the given object into the given DOM element
		 * 
		 * @param {HTMLElement} p The DOM element to draw the given object into
		 * @param {Object} obj The object to draw
		 * @abstract
		 */
		drawInto: function(p, obj) {
			throw "NotImplementedException";
		},
		
		
		// Utility methods
		/**
		 * @param {String} tagName
		 * @param {String} [Optional] The ID to give to the new element
		 * @param {String} [Optional] The class name to give to the new element
		 */
		newElement: function(tagName) {
			var id = (arguments.length >= 2) ? arguments[1] : null;
			var className = (arguments.length >= 3) ? arguments[2] : null;
			
			var e = document.createElement(tagName);
			if (id !== null)
				e.id = id;
			if (className !== null)
				e.className = className;
			return e;
		},
		
		/**
		 * @param {String} text
		 */
		newTextNode: function(text) {
			return document.createTextNode(text);
		}
	};
});
