/**
 * A value which can be used to populate one of the gaps of a puzzle 
 * 
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	var nextId = 0;
	return {
		/**
		 * @param {String} value
		 * @constructor
		 */
		create: function(value) {
			var self = Objects.subclass(this, {
				id: Option.nextId++,
				value: value
			});
			return self;
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
