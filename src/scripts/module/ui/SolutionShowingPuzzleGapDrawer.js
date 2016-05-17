/**
 * An AlwaysCorrectPuzzleGapDrawer which also adds classes to drawn puzzles indicating if they were
 * filled correctly or not. Keeping this functionallity out of AlwaysCorrectPuzzleGapDrawer helps
 * when the results behaviour need to be changed on its own.
 * 
 * @author jakemarsden
 */
define([
	"util/Objects",
	"util/Utils",
	"./AlwaysCorrectPuzzleGapDrawer"
], function(Objects, Utils, AlwaysCorrectPuzzleGapDrawer) {
	
	return Objects.subclass(AlwaysCorrectPuzzleGapDrawer, {
		/**
		 * @param {PuzzleOptionDrawer} optionDrawer
		 * @constructor
		 */
		create: function(optionDrawer) {
			return AlwaysCorrectPuzzleGapDrawer.create.call(this, optionDrawer);
		},
		
		/**
		 * @override
		 */
		createRootElement: function(gap) {
			var e = AlwaysCorrectPuzzleGapDrawer.createRootElement.call(this, gap);
			Utils.addClass(e, gap.isFilledCorrectly() ? "correctlyFilled" : "incorrectlyFilled");
			return e;
		}
	});
});
