/**
 * Static utility methods to help with inheritance and equality.
 * 
 * @author jakemarsden
 */
define([], function() {
	return {
		/**
		 * Utility for using prototypal inheritance
		 * 
		 * @param {Object} superclass The base class to extend from (will not be modified by this function)
		 * @param {Array<Object>} [vararg] The extensions to apply to the superclass to create a subclass
		 * @return {Object} A new object consisting of the given superclass combined with the given
		 *     extensions
		 * @see http://aaditmshah.github.io/why-prototypal-inheritance-matters/#toc_11
		 */
		subclass: function(superclass) {
			var object = Object.create(superclass);
			for (var i = (arguments.length - 1); i >= 1; i--) {
				var extension = arguments[i];
				for (var property in extension) {
					if (Object.hasOwnProperty.call(extension, property) || typeof object[property] === "undefined") {
						object[property] = extension[property];
					}
				}
			}
			return object;
		},

		/**
		 * @param {?} a
		 * @param {?} b
		 * @return {boolean} True if the given objects can be considered equal. It is expected that the
		 *     first parameter has an "equals" method if it is not a primitive type.
		 */
		equals: function(a, b) {
			if (a === null || typeof a === "undefined")
				return b === null || typeof b === "undefined";
			
			if (typeof a === "number")
				return a === b;
			
			if (typeof a === "string")
				return a === b;
			
			if (typeof a === "function")
				return a === b;
			
			if (Array.isArray(a)) {
				if (!Array.isArray(b))
					return false;
				if (a.length !== b.length)
					return false;
				for (var i = 0; i < a.length; i++) {
					if (!this.equals(a[i], b[i])) {
						return false;
					}
				}
				return true;
			}
			
			return a.equals(b);
		}
	};
});
