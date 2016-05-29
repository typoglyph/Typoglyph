/**
 * Similar to a standard PuzzleDrawer except every single gap and every single sentence character
 * is wrapped in a <span class="puzzleSentenceChar">.
 * 
 * @author jakemarsden
 */
define([
	"./PuzzleDrawer",
	"puzzle/Character",
	"puzzle/Gap",
	"util/Objects",
	"util/Utils"
], function(PuzzleDrawer, Character, Gap, Objects, Utils) {

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
			
			for (var i = 0; i < puzzle.length(); i++) {
				var fragment = puzzle.getSentenceFragmentAt(i);
				if (Objects.isInstanceOf(fragment, Character)) {
					var drawnChar = wrapWithTd(this.newTextNode(fragment.value));
					if (fragment.value === "") {
						Utils.addClass(drawnChar, "blank");
					}
					if (fragment.value === " ") {
						Utils.addClass(drawnChar, "space");
					}
					p.appendChild(drawnChar);
					
				} else if (Objects.isInstanceOf(fragment, Gap)) {
					var drawnGap = this.gapDrawer.draw(fragment);
					p.appendChild(wrapWithTd(drawnGap));
					
				} else {
					throw "Unknown SentenceFragment type: " + fragment;
				}
			}
		}
	});
});
