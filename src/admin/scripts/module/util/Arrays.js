/**
 * Static utility methods to help deal with arrays
 * 
 * @author jakemarsden
 */
define([], function() {
	return {
		/**
		 * Returns an index in the array, if an element in the array satisfies the provided testing
		 * function. Otherwise -1 is returned.
		 * 
		 * @param {Array} array
		 * @param {function(Object, int, Array)} predicate
		 * @param {Object} [Optional] An extra parameter to pass to the predicate
		 * @return int
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
		 */
		findIndex: function(array, predicate) {
			if (array === null) {
				throw new TypeError('Array.prototype.findIndex called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(array);
			var length = list.length >>> 0;
			var thisArg = arguments[2];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return i;
				}
			}
			return -1;
		},
		
		/**
		 * @param {Array} array
		 * @param {Object} element
		 * @return {boolean} True if the array contains the specified element
		 */
		contains: function(array, element) {
			return array.indexOf(element) !== -1;
		},

		/**
		 * @param {Array} array
		 * @param {Object} element The element to remove from the array
		 */
		remove: function(array, element) {
			var predicate = function(arrayElement, arrayIndex, arr) { return arrayElement === element; };
			var index = this.findIndex(array, predicate);
			if (index !== -1) {
				array.splice(index, 1);
			}
		},

		/**
		 * @param {Array} array
		 * @param {Object} element The element to remove all references of from the array
		 */
		removeAll: function(array, element) {
			while (this.contains(array, element))
				this.remove(array, element);
		},

		/**
		 * @param {Array} array
		 * @param {Object} element The element to add to the array if it isn't already present
		 */
		pushUnique: function(array, element) {
			if (!this.contains(array, element))
				array.push(element);
		}
	};
});