/**
 * Used to generate a visual representation of a Typoglyph puzzle
 * 
 * @author jakemarsden
 */
define([
	"./Drawer",
	"puzzle/Character",
	"puzzle/Gap",
	"util/Objects"
], function(Drawer, Character, Gap, Objects) {

	return Objects.subclass(Drawer, {
		/**
		 * @param {PuzzleGapDrawer} gapDrawer
		 * @constructor
		 */
		create: function(gapDrawer) {
			var self = Drawer.create.call(this);
			self.gapDrawer = gapDrawer;
			return self;
		},
		
		/**
		 * @param {puzzle/Puzzle} obj
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(obj) {
			var msg = "This class only supports the 'drawInto' method";
			throw "UnsupportedOperationException: " + msg;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {puzzle/Puzzle} puzzle
		 * @override
		 */
		drawInto: function(p, puzzle) {
			// Bundle sequential characters into the same text node as an optimisation
			var textNode = null;

			for (var i = 0; i < puzzle.length(); i++) {
				var fragment = puzzle.getSentenceFragmentAt(i);

				if (Objects.isInstanceOf(fragment, Character)) {
					if (textNode === null) {
						// Start a new chain of sequential characters
						textNode = this.newTextNode("");
						p.appendChild(textNode);
					}
					textNode.textContent += fragment.value;

				} else if (Objects.isInstanceOf(fragment, Gap)) {
					// This gap has broken the chain of sequential characters
					// We'll need to start a new one when the next character comes around
					textNode = null;
					p.appendChild(this.gapDrawer.draw(fragment));

				} else {
					throw "Unknown SentenceFragment type: " + fragment;
				}
			}
		}
	});
});
