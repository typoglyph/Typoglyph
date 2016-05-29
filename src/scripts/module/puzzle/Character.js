/**
 * Represents a single fixed character within a puzzle's sentence. This cannot be changed by the
 * user when solving a puzzle. Multiple characters cannot be held by the same object to help
 * simplify the game logic.
 *
 * @author jakemarsden
 */
define(["./SentenceFragment", "util/Objects"], function(SentenceFragment, Objects) {
	
	return Objects.subclass(SentenceFragment, {
		/**
		 * @param {String} value Must be a single character
		 * @constructor
		 */
		create: function (value) {
			if (value.length !== 1) {
				throw "Not a character: " + value;
			}
			var self = SentenceFragment.create.call(this);
			self.value = value;
			return self;
		},

		/**
		 * @return {String}
		 */
		toString: function() {
			return this.value;
		},
		/**
		 * @param {Character} other
		 * @return {boolean}
		 */
		equals: function(other) {
			return other !== null
				&& Objects.equals(this.value, other.value);
		}
	});
});
