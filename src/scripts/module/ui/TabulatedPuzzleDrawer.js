/**
 * Similar to a standard PuzzleDrawer except every single gap and every single sentence character
 * is wrapped in a <span class="puzzleSentenceChar">.
 * 
 * @author jakemarsden
 */
define(["util/Objects", "util/Utils", "./PuzzleDrawer"], function(Objects, Utils, PuzzleDrawer) {
	return Objects.subclass(PuzzleDrawer, {
		/**
		 * @param {PuzzleGapDrawer} gapDrawer
		 * @constructor
		 */
		create: function(gapDrawer) {
			return PuzzleDrawer.create.call(this, gapDrawer);
		},
		
		
		/**
		 * @param {HTMLElement} p
		 * @param {puzzle/Puzzle} puzzle
		 * @override
		 */
		drawInto: function(p, puzzle) {
			var self = this;
			
			/**
			 * @param {HTMLElement} e
			 * @return {HTMLElement}
			 */
			function wrapWithTd(e) {
				var td = self.newElement("span", "", "puzzleSentenceChar");
				td.appendChild(e);
				return td;
			}
			
			// Iterate length+1 in case there's a gap after the last character
			for (var i = 0; i < puzzle.sentence.length + 1; i++) {
			
				var gap = puzzle.getGapAtPosition(i);
				if (gap !== null) {
					var drawnGap = this.gapDrawer.draw(gap);
					p.appendChild(wrapWithTd(drawnGap));
				}
				var sentenceChar = wrapWithTd(this.newTextNode(puzzle.sentence.charAt(i)));
				if (puzzle.sentence.charAt(i) === "") {
					Utils.addClass(sentenceChar, "blank");
				}
				if (puzzle.sentence.charAt(i) === " ") {
					Utils.addClass(sentenceChar, "space");
				}
				p.appendChild(sentenceChar);
			}
		}
	});
});
