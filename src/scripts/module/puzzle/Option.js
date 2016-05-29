/**
 * A value which can be used to populate one of the gaps of a puzzle
 * 
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	
	var previousId = 0;
	return {
		/**
		 * @param {String} value
		 * @constructor
		 */
		create: function(value) {
			return Objects.subclass(this, {
				id: previousId++,
				value: value
			});
		},
		
		/**
		 * @return {String} toString
		 */
		toString: function() {
			return this.value;
		},
		/**
		 * @param {Option} other
		 * @return {boolean}
		 */
		equals: function(other) {
			return other !== null
				&& Objects.equals(this.value, other.value);
		}
	};
});
