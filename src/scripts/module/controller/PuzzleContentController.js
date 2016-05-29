/**
 * @author jakemarsden
 */
define([
	"interact",
	"puzzle/Gap",
	"ui/PuzzleDrawer",
	"ui/PuzzleGapDrawer",
	"ui/PuzzleOptionBarDrawer",
	"ui/PuzzleOptionDrawer",
	"util/Objects",
	"util/Utils",
	"./ContentController"
], function(Interact, Gap, PuzzleDrawer, PuzzleGapDrawer, PuzzleOptionBarDrawer, PuzzleOptionDrawer,
		Objects, Utils, ContentController) {
	
	return Objects.subclass(ContentController, {
		/**
		 * @constructor
		 */
		create: function(e) {
			var optionDrawer = PuzzleOptionDrawer.create();
			
			var self = ContentController.create.call(this, e);
			self.puzzleDrawer = PuzzleDrawer.create(PuzzleGapDrawer.create(optionDrawer));
			self.optionBarDrawer = PuzzleOptionBarDrawer.create(optionDrawer);
			self.shownPuzzle = null;
			self.puzzleCompleteListener = null;
			return self;
		},
		
		
		/**
		 * Displays the given puzzle for the user to start solving
		 * 
		 * @param {puzzle/Puzzle} puzzle
		 */
		showPuzzle: function(puzzle) {
			this.shownPuzzle = puzzle;
			this.renderCurrentPuzzle();
		},
		
		/**
		 * Sets up a listener which will be called when the user has completed the shown puzzle. The
		 * listener will be given two arguments: the puzzle which was completed, and a boolean
		 * indicating if it was solved correctly.
		 * 
		 * Pass null to remove the current listener.
		 * 
		 * @param {function(puzzle/Puzzle, boolean)} listener
		 */
		setOnPuzzleCompleteListener: function(listener) {
			this.puzzleCompleteListener = listener;
		},
		
		/**
		 * (Re)Draw the current puzzle on the screen
		 */
		renderCurrentPuzzle: function() {
			var puzzle = this.shownPuzzle;
			var puzzleElement = this.element.querySelector("#puzzleSentence");
			Utils.removeAllChildren(puzzleElement);
			this.puzzleDrawer.drawInto(puzzleElement, puzzle);
			
			var optionBarElement = this.element.querySelector("#puzzleOptions");
			Utils.removeAllChildren(optionBarElement);
			this.optionBarDrawer.drawInto(optionBarElement, puzzle.options);
		},
		
		
		/**
		 * @override
		 */
		onInit: function() {
			var self = this;
			self.element.querySelector("#nextPuzzle.button").addEventListener("click", function(event) {
				if (self.puzzleCompleteListener !== null) {
					self.puzzleCompleteListener(event, self.shownPuzzle, self.shownPuzzle.areAllGapsFilledCorrectly());
				}
			});
			self.element.querySelector("#resetPuzzle.button").addEventListener("click", function(event) {
				var puzzle = self.shownPuzzle;
				for (var i = 0; i < puzzle.gaps.length; i++) {
					puzzle.gaps[i].currentChoice = null;
				}
				self.renderCurrentPuzzle();
			});
		},
		
		/**
		 * @override
		 */
		onPrepare: function() {
			this.prepareTouchControls();
		},
		/**
		 * @override
		 */
		onDestroy: function() {
			this.destroyTouchControls();
		},
		
		
		/**
		 * @private
		 */
		prepareTouchControls: function() {
			var self = this;
			
			// Defines how puzzle options can be dragged
			Interact(".puzzleOption").draggable({
				inertia: false,
				autoScroll: false,
				restrict: {
					restriction: function() { return document.body.getBoundingClientRect(); },
					elementRect: {
						left: 0,
						right: 1,
						top: 0,
						bottom: 1
					}
				},
				max: 1,
				maxPerElement: 1,
				
				/**
				 * Called periodically as event.target is being dragged around so the element's
				 * position can be updated. event.dx and event.dy describe how far the element has
				 * been dragged since the previous call to this function. Note that the given event.dx
				 * and event.dy will never take event.target outside the defined restriction area.
				 * 
				 * @param {Event} event
				 */
				onmove: function(event) {
					var dragDistanceX = parseFloat(event.target.getAttribute("data-dragDistanceX")) || 0;
					var dragDistanceY = parseFloat(event.target.getAttribute("data-dragDistanceY")) || 0;
					event.target.setAttribute("data-dragDistanceX", dragDistanceX += event.dx);
					event.target.setAttribute("data-dragDistanceY", dragDistanceY += event.dy);
					Utils.setElementTranslation(event.target, dragDistanceX, dragDistanceY);
				},
				/**
				 * Called when event.target has just started being dragged, just before the first call
				 * to onmove().
				 * 
				 * Note: This function is called before ondropactivate() if a drop zone has been set to
				 * accept event.target.
				 * 
				 * @param {Event} event
				 */
				onstart: function(event) {
					console.debug("onstart: target=" + event.target.id);
					Utils.addClass(event.target, "highlight");
				},
				/**
				 * Called when event.target has just stopped being dragged, just after the last call to
				 * onmove().
				 * 
				 * Note: This function is called after ondropdeactivate() if a drop zone has been set
				 * to accept event.target.
				 * 
				 * @param {Event} event
				 */
				onend: function(event) {
					console.debug("onend: target=" + event.target.id);
					Utils.removeClass(event.target, "highlight");
				}
			});
			
			// Defines how puzzle gaps (and options which are inside gaps) can be dropzones
			// Potentially inefficient: Actually makes every element on the page a dropzone
			Interact("*").dropzone({
				accept: ".puzzleOption", // Only allow puzzle options to be dropped here
				overlap: 0.1,
				
				/**
				 * Called just after event.relatedTarget has been dropped anywhere inside event.target
				 * (the dropzone)
				 * 
				 * @param {Event} event
				 */
				ondrop: function(event) {
					console.debug("ondrop: target=" + event.relatedTarget.id + ", origin=" + event.relatedTarget.parentNode.id + ", dest=" + event.target.id);
					
					if (Utils.isOfClass(event.relatedTarget, "puzzleOption")) {
						// A puzzle option is being dropped somewhere
						var optionId = parseInt(event.relatedTarget.getAttribute("data-id"));
						var option = self.shownPuzzle.getOptionById(optionId);
						
						if (Utils.isOfClass(event.relatedTarget.parentNode, "puzzleGap")) {
							// A puzzle option is being dragged from a puzzle gap
							var originGapId = parseInt(event.relatedTarget.parentNode.getAttribute("data-id"));
							var originGap = self.shownPuzzle.getSentenceFragmentById(originGapId);
							if (!Objects.isInstanceOf(originGap, Gap)) {
								throw "SentenceFragment with ID [" + originGapId + "] is not a gap: " + originGap;
							}
							originGap.currentChoice = null;
						}
						
						if (Utils.isOfClass(event.target, "puzzleGap")) {
							// A puzzle option is being dropped into a puzzle gap
							var destinationGapId = parseInt(event.target.getAttribute("data-id"));
							var destinationGap = self.shownPuzzle.getSentenceFragmentById(destinationGapId);
							if (!Objects.isInstanceOf(destinationGap, Gap)) {
								throw "SentenceFragment with ID [" + destinationGapId + "] is not a gap: " + destinationGap;
							}
							destinationGap.currentChoice = option;
							
						} else if (Utils.isOfClass(event.target, "puzzleOption")
								&& Utils.isOfClasses(event.target.parentNode, "puzzleGap")) {
							// A puzzle option is being dropped into an already-populated gap
							var destinationGapId = parseInt(event.target.parentNode.getAttribute("data-id"));
							var destinationGap = self.shownPuzzle.getSentenceFragmentById(destinationGapId);
							if (!Objects.isInstanceOf(destinationGap, Gap)) {
								throw "SentenceFragment with ID [" + destinationGapId + "] is not a gap: " + destinationGap;
							}
							destinationGap.currentChoice = option;
						}
					}
				},
				/**
				 * Called when event.relatedTarget has been picked up and has just started being
				 * dragged
				 *
				 * @param {Event} event
				 */
				ondropactivate: function(event) {
				},
				/**
				 * Called when event.relatedTarget has been dropped. If event.relatedTarget is inside
				 * the dropzone, this function will be called just *after* ondrop() (but will still be
				 * called even if it's outside the drop zone).
				 * 
				 * @param {Event} event
				 */
				ondropdeactivate: function(event) {
					self.renderCurrentPuzzle();
				}
			});
		},
		/**
		 * @private
		 */
		destroyTouchControls: function() {
			Interact(".puzzleOption").draggable({ enabled: false });
			Interact("*").dropzone({ enabled: false });
		}
	});
});
