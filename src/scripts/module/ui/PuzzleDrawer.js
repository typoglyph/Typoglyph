/**
 * Used to generate a visual representation of a Typoglyph puzzle
 * 
 * @author jakemarsden
 */
define(["util/Objects", "./Drawer"], function(Objects, Drawer) {
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
			var sentenceFragment = null;
			
			// Iterate length+1 in case there's a gap after the last character
			for (var i = 0; i < puzzle.sentence.length + 1; i++) {
				
				var gap = puzzle.getGapAtPosition(i);
				if (gap !== null) {
					var sentenceFragment = null; // a new one will be started for the next character
					var drawnGap = this.gapDrawer.draw(gap);
					p.appendChild(drawnGap);
				}
				
				// Start a new sentence fragment if necessary
				if (sentenceFragment === null) {
					sentenceFragment = this.newTextNode("");
					p.appendChild(sentenceFragment);
				}
				// Append character to the sentence fragment
				sentenceFragment.textContent += puzzle.sentence.charAt(i);
			}
		}
	});
});
