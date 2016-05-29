/**
 * Represents one part of a Puzzle's sentence, for example a fixed character in the sentence
 * or a gap in the sentence to be filled by the user.
 * 
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {

	var previousId = 0;
	return {
		/**
		 * @constructor
		 */
		create: function() {
			return Objects.subclass(this, {
				id: previousId++
			});
		}
	};
});
