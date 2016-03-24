/* Common functionallity which adds additional features to the JavaScript language. This must be
   the first script defined for each HTML page. */


/**
 * Utility for using prototypal inheritance
 * 
 * @see http://aaditmshah.github.io/why-prototypal-inheritance-matters/#toc_11
 */
Object.prototype.extend = function() {
	var object = Object.create(this);
	for (var i = (arguments.length - 1); i >= 0; i--) {
		var extension = arguments[i];
		for (var property in extension) {
			if (Object.hasOwnProperty.call(extension, property) || typeof object[property] === "undefined") {
				object[property] = extension[property];
			}
		}
	}
	return object;
};


/**
 * A translation of https://docs.oracle.com/javase/7/docs/api/java/util/Objects.html for
 * JavaScript:
 *
 * This class consists of static utility methods for operating on objects. These utilities include
 * null-safe or null-tolerant methods for computing the hash code of an object, returning a string
 * for an object, and comparing two objects.
 * 
 * @see https://docs.oracle.com/javase/7/docs/api/java/util/Objects.html
 * @author jakemarsden
 */
var Objects = Object.create(null);

/**
 * @param {?} a
 * @param {?} b
 * @return {boolean} True if the given objects can be considered equal. It is expected that the
 *     first parameter has an "equals" method if it is not a primitive type.
 */
Objects.equals = function(a, b) {
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
			if (!Objects.equals(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}
	
	return a.equals(b);
}
