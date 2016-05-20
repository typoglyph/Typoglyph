/**
 * @author jakemarsden
 */
define([
	"interact",
	"puzzle/Gap",
	"puzzle/Option",
	"ui/PuzzleGapDrawer",
	"ui/PuzzleOptionBarDrawer",
	"ui/PuzzleOptionDrawer",
	"ui/TabulatedPuzzleDrawer",
	"util/Arrays",
	"util/Objects",
	"util/Utils",
	"./ContentController"
], function(Interact, Gap, Option, PuzzleGapDrawer, PuzzleOptionBarDrawer, PuzzleOptionDrawer,
		TabulatedPuzzleDrawer, Arrays, Objects, Utils, ContentController) {
	
	return Objects.subclass(ContentController, {
		/**
		 * @constructor
		 */
		create: function(e) {
			var optionDrawer = PuzzleOptionDrawer.create();
			var self = ContentController.create.call(this, e);
			self.puzzleDrawer = TabulatedPuzzleDrawer.create(PuzzleGapDrawer.create(optionDrawer, true));
			self.optionsDrawer = PuzzleOptionBarDrawer.create(optionDrawer);
			self.puzzle = null;
			self.globalOptions = null;
			self.navigateBackListener = null;
			return self;
		},
		
		/**
		 * @param {puzzle/Puzzle} puzzle
		 */
		showPuzzleForEditing: function(puzzle) {
			this.puzzle = puzzle;
			this.redrawPuzzle();
		},
		
		/**
		 * @param {Array<puzzle/Option>} options
		 */
		setGlobalOptions: function(options) {
			this.globalOptions = options;
			this.redrawGlobalOptions();
		},
		
		/**
		 * @param {function()} listener
		 */
		setOnNavigateBackListener: function(listener) {
			this.navigateBackListener = listener;
		},
		
		
		/**
		 * @override
		 */
		onInit: function() {
			var self = this;
			self.element.querySelector("#backButton").addEventListener("click", function(event) {
				if (self.navigateBackListener !== null)
					self.navigateBackListener();
			});
			self.element.querySelector("#globalOptions #custom button").addEventListener("click", function(event) {
				console.debug("(#globalOptions #custom button).onClick: event=" + event);
				var inputElement = self.element.querySelector("#globalOptions #custom input");
				var value = inputElement.value;
				if (value.length !== 0) {
					value = value.charAt(0);
					
					// see if there's already an option with the same value
					if (Arrays.findIndex(self.globalOptions, function(item, index, array) { return value === item.value; }) === -1) {
						var option = Option.create(value);
						self.globalOptions.push(option);
						self.redrawGlobalOptions();
					}
					inputElement.value = "";
				}
			});
			self.element.querySelector("#globalOptions #custom input").addEventListener("input", function(event) {
				// Make sure there's never more than one character
				if (event.target.value.length > 1) {
					event.target.value = event.target.value.charAt(0);
				}
			});
		},
		
		/**
		 * @override
		 */
		onPrepare: function() {
			this.redrawGlobalOptions();
			this.prepareTouchControls();
		},
		/**
		 * @override
		 */
		onDestroy: function() {
			Utils.removeAllChildren(this.element.querySelector("#puzzleId"));
			Utils.removeAllChildren(this.element.querySelector("#puzzleSentence"));
			Utils.removeAllChildren(this.element.querySelector("#puzzleOptions"));
			this.destroyTouchControls();
		},
		
		/**
		 * @private
		 */
		redrawPuzzle: function() {
			var idElement = this.element.querySelector("#puzzleId");
			var sentenceElement = this.element.querySelector("#puzzleSentence");
			var optionsElement = this.element.querySelector("#puzzleOptions");
			
			idElement.innerHTML = this.puzzle.id;
			Utils.removeAllChildren(sentenceElement);
			Utils.removeAllChildren(optionsElement);
			this.puzzleDrawer.drawInto(sentenceElement, this.puzzle);
			this.optionsDrawer.drawInto(optionsElement, this.puzzle.options);
		},
		/**
		 * @private
		 */
		redrawGlobalOptions: function() {
			var e = this.element.querySelector("#globalOptions #list");
			Utils.removeAllChildren(e);
			this.optionsDrawer.drawInto(e, this.globalOptions);
		},
		
		/**
		 * @private
		 */
		prepareTouchControls: function() {
			var self = this;
			
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
				
				onmove: function(event) {				
					var dragDistanceX = parseFloat(event.target.getAttribute("data-dragDistanceX")) || 0;
					var dragDistanceY = parseFloat(event.target.getAttribute("data-dragDistanceY")) || 0;
					event.target.setAttribute("data-dragDistanceX", dragDistanceX += event.dx);
					event.target.setAttribute("data-dragDistanceY", dragDistanceY += event.dy);
					Utils.setElementTranslation(event.target, dragDistanceX, dragDistanceY);
				},
				onstart: function(event) {
					console.debug("onstart: target=" + event.target.id);
					Utils.addClass(event.target, "highlight");
				},
				onend: function(event) {
					console.debug("onend: target=" + event.target.id);
					Utils.removeClass(event.target, "highlight");
				}
			});
			
			
			Interact("*").dropzone({
				accept: ".puzzleOption",
				overlap: 0.1,
				
				ondrop: function(event) {
					console.debug("ondrop: target=" + event.relatedTarget.id + ", origin=" + event.relatedTarget.parentNode.id + ", dest=" + event.target.id);
					onDropPuzzleOption(event, event.relatedTarget, event.target);
				},
				ondragenter: function(event) {
					Utils.addClass(event.target, "dropTarget");
				},
				ondragleave: function(event) {
					Utils.removeClass(event.target, "dropTarget");
				},
				ondropactivate: function(event) {
				},
				ondropdeactivate: function(event) {
					self.redrawPuzzle();
					self.redrawGlobalOptions();
				}
			});
			
			
			function onDropPuzzleOption(event, draggedElement, dropzone) {
				var draggedOptionId = parseInt(draggedElement.getAttribute("data-id"));
				var draggedOption = null;
				
				
				// From
				var draggedFromPuzzleGap = Utils.isOfClass(draggedElement.parentNode, "puzzleGap");
				var draggedFromPuzzleOptions = draggedElement.parentNode.id === "puzzleOptions";
				var draggedFromGlobalOptions = draggedElement.parentNode.id === "list";
				
				// To
				var droppedIntoPuzzleSentence = dropzone.tagName.toLowerCase() === "td" && dropzone.parentNode.id === "puzzleSentence";
				var droppedIntoPuzzleGap = Utils.isOfClass(dropzone, "puzzleGap");
				var droppedOntoPopulatedPuzzleGap = Utils.isOfClass(dropzone, "puzzleOption") && Utils.isOfClass(dropzone.parentNode, "puzzleGap");
				var droppedIntoPuzzleOptions = dropzone.id === "puzzleOptions";
				var droppedOntoOtherPuzzleOption = Utils.isOfClass(dropzone, "puzzleOption") && dropzone.parentNode.id === "puzzleOptions";
				
				
				// From
				if (draggedFromPuzzleGap) {
					var originGapId = parseInt(draggedElement.parentNode.getAttribute("data-id"));
					var originGap = self.puzzle.getGapById(originGapId);
					draggedOption = originGap.solution;
					originGap.solution = null;
					
				} else if (draggedFromPuzzleOptions) {
					draggedOption = self.puzzle.getOptionById(draggedOptionId);
					if (!droppedIntoPuzzleGap && !droppedOntoPopulatedPuzzleGap) {
						Arrays.remove(self.puzzle.options, draggedOption);
					}
					
				} else if (draggedFromGlobalOptions) {
					var index = Arrays.findIndex(self.globalOptions, function(item, index, array) {
						return item.id === draggedOptionId;
					});
					draggedOption = self.globalOptions[index];	
				}
				
				// To
				if (droppedIntoPuzzleSentence) {
					var position = getGapPositionFromTableCell(dropzone);
					if (self.puzzle.getGapAtPosition(position) === null) {
						var gap = Gap.create(position, Option.create(draggedOption.value));
						self.puzzle.gaps.push(gap);
					}
					
				} else if (droppedIntoPuzzleGap || droppedOntoPopulatedPuzzleGap) {
					var gapElement = (droppedIntoPuzzleGap) ? dropzone : dropzone.parentNode;
					var gapId = parseInt(gapElement.getAttribute("data-id"));
					var gap = self.puzzle.getGapById(gapId);
					gap.solution = draggedOption;
					
				} else if (droppedIntoPuzzleOptions || droppedOntoOtherPuzzleOption) {
					var options = self.puzzle.options;
					var existingIndex = Arrays.findIndex(options, function(item, index, array) {
						return item.value === draggedOption.value;
					});
					if (existingIndex === -1) {
						// doesn't exist yet
						options.push(draggedOption);
					}
				}
			}
			
			function getGapPositionFromTableCell(tableCell) {
				var position = tableCell.cellIndex;
				for (var i = 0; i < (position - 1); i++) {
					if (self.puzzle.getGapAtPosition(i)) {
						// Other gaps don't count as a position, but do take up a table cell
						position--;
					}
				}
				return position;
			}
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
