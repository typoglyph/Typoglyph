/**
 * A PuzzleGapDrawer which displays the solutions of the gaps it draws, instead of the actual
 * chosen options. Keeping this functionallity out of PuzzleGapDrawer helps when the results/admin
 * behaviour needs to be changed on its own.
 * 
 * @author jakemarsden
 */
define(["util/Objects", "./PuzzleGapDrawer"], function(Objects, PuzzleGapDrawer) {
	return Objects.subclass(PuzzleGapDrawer, {
		/**
		 * @param {PuzzleOptionDrawer} optionDrawer
		 * @constructor
		 */
		create: function(optionDrawer) {
			return PuzzleGapDrawer.create.call(this, optionDrawer);
		},
		
		/**
		 * @override
		 */
		getOptionToDraw: function(gap) {
			return gap.solution;
		}
	});
});
