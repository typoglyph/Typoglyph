// Imports
var Utils = typoglyph.util;
var PuzzleDrawer = typoglyph.ui.PuzzleDrawer;
var PuzzleGapDrawer = typoglyph.ui.PuzzleGapDrawer;
var PuzzleOptionBarDrawer = typoglyph.ui.PuzzleOptionBarDrawer;
var PuzzleOptionDrawer = typoglyph.ui.PuzzleOptionDrawer;


MasterController = {
	/**
	 * @param {Array<ContentController>} controllers
	 * @constructor
	 */
	create: function(controllers) {
		var self = Objects.subclass(this, {
			controllers: controllers,
		});
		self.hideAll();
		return self;
	},
	
	/**
	 * @param {Controller} controller The controller to show
	 */
	show: function(controller) {
		for (var i = 0; i < this.controllers.length; i++) {
			if (this.controllers[i] !== controller) {
				this.controllers[i].setVisible(false);
			}
		}
		controller.setVisible(true);
	},
	hideAll: function() {
		for (var i = 0; i < this.controllers.length; i++) {
			this.controllers[i].setVisible(false);
		}
	}
};



ContentController = {
	/**
	 * @param {HTMLElement} e The element representing the content
	 * @constructor
	 */
	create: function(e) {
		var self = Objects.subclass(this, {
			element: e,
			initialized: false
		});
		return self;
	},
	
	isVisible: function() {
		return (this.element.style.display !== "none");
	},
	setVisible: function(newValue) {
		var oldValue = this.isVisible();
		if (oldValue !== newValue) {
			if (newValue) {
				if (!this.initialized) {
					this.onInit();
					this.initialized = true;
				}
				this.onPrepare();
			}
			this.element.style.display = (newValue) ? "initial" : "none";
			if (this.initialized) this.onVisibilityChanged(oldValue, newValue);
			if (!newValue && this.initialized) this.onDestroy();
		}
	},
	toggleVisibility: function() {
		this.setVisible(!this.isVisible());
	},
	
	/**
	 * Can be overridden by subclasses. Called just before the very first onPrepare().
	 */
	onInit: function() {
	},
	/**
	 * Can be overridden by subclasses. Called just before the element is shown.
	 */
	onPrepare: function() {
	},
	/**
	 * Can be overridden by subclasses. Called just after the element is hidden.
	 */
	onDestroy: function() {
	},
	/**
	 * Can be overridden by subclasses. Called just after the element has been shown or hidden.
	 * 
	 * @param {boolean} oldValue If it was visible before the change
	 * @param {boolean} newValue If it is visible now
	 */
	onVisibilityChanged: function(oldValue, newValue) {
	}
};




PuzzleContentController = Objects.subclass(ContentController, {
	/**
	 * @constructor
	 */
	create: function(e) {
		var optionDrawer = PuzzleOptionDrawer.create();
		var gapDrawer = PuzzleGapDrawer.create(optionDrawer, false);
		
		var self = ContentController.create.call(this, e);
		self.puzzleDrawer = PuzzleDrawer.create(gapDrawer);
		self.optionBarDrawer = PuzzleOptionBarDrawer.create(optionDrawer);
		self.shownPuzzle = null;
		self.puzzleCompleteListener = null;
		return self;
	},
	
	
	/**
	 * Displays the given puzzle for the user to start solving
	 * 
	 * @param {Puzzle} puzzle
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
	 * @param {function(Puzzle, boolean)} listener
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
		self.initTouchControls();
	},
	
	/**
	 * @private
	 */
	initTouchControls: function() {
		var self = this;
		
		// Defines how puzzle options can be dragged
		interact(".puzzleOption").draggable({
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
				console.debug("onmove: target=" + event.target.id);
				
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
		interact("*").dropzone({
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
				
				if (Utils.getClasses(event.relatedTarget).contains("puzzleOption")) {
					// A puzzle option is being dropped somewhere
					var optionId = parseInt(event.relatedTarget.getAttribute("data-id"));
					var option = self.shownPuzzle.getOptionById(optionId);
					
					if (Utils.getClasses(event.relatedTarget.parentNode).contains("puzzleGap")) {
						// A puzzle option is being dragged from a puzzle gap
						var originGapId = parseInt(event.relatedTarget.parentNode.getAttribute("data-id"));
						self.shownPuzzle.getGapById(originGapId).currentChoice = null;
					}
					
					if (Utils.getClasses(event.target).contains("puzzleGap")) {
						// A puzzle option is being dropped into a puzzle gap
						var destinationGapId = parseInt(event.target.getAttribute("data-id"));
						self.shownPuzzle.getGapById(destinationGapId).currentChoice = option;
						
					} else if (Utils.getClasses(event.target).contains("puzzleOption")
							&& Utils.getClasses(event.target.parentNode).contains("puzzleGap")) {
						// A puzzle option is being dropped into an already-populated gap
						var destinationGapId = parseInt(event.target.parentNode.getAttribute("data-id"));
						self.shownPuzzle.getGapById(destinationGapId).currentChoice = option;
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
				console.debug("ondropactivate: target=" + event.relatedTarget.id + ", origin=" + event.relatedTarget.parentNode.id + ", dest=" + event.target.id);
			},
			/**
			 * Called when event.relatedTarget has been dropped. If event.relatedTarget is inside
			 * the dropzone, this function will be called just *after* ondrop() (but will still be
			 * called even if it's outside the drop zone).
			 * 
			 * @param {Event} event
			 */
			ondropdeactivate: function(event) {
				var originId = (event.relatedTarget.parentNode === null) ? null : event.relatedTarget.parentNode.id;
				console.debug("ondropdeactivate: target=" + event.relatedTarget.id + ", origin=" + originId + ", dest=" + event.target.id);
				self.renderCurrentPuzzle();
			}
		});
	}
});




CompletionContentController = Objects.subclass(ContentController, {
	/**
	 * @constructor
	 */
	create: function(e) {
		var self = ContentController.create.call(this, e);
		self.puzzleDrawer = PuzzleDrawer.create(
				PuzzleGapDrawer.create(
				PuzzleOptionDrawer.create(), true));
		self.skipListener = null;
		return self;
	},
	
	/**
	 * Displays the given statistics for the user
	 * 
	 * @param {StatisticsTracker} statsTracker
	 */
	showResults: function(statsTracker) {
		var latestStat = statsTracker.getLatestStatistic();
		var resultElement = this.element.querySelector("#result");
		resultElement.innerHTML = (latestStat.result ? "Correct!" : "Incorrect!");
		
		var puzzleElement = this.element.querySelector("#puzzleAnswer");
		Utils.removeAllChildren(puzzleElement);
		this.puzzleDrawer.drawInto(puzzleElement, latestStat.puzzle);
	},
	
	/**
	 * Sets up a listener to be called when the user decides to skip past the completion page. Pass
	 * null to remove any current listener.
	 * 
	 * @param {function()} listener
	 */
	setOnSkipListener: function(listener) {
		this.skipListener = listener;
	},
	
	/**
	 * @override
	 */
	onInit: function() {
		var self = this;
		self.element.addEventListener("click", function(event) {
			if (self.skipListener !== null) {
				self.skipListener();
			}
		});
	}
});

ResultsContentController = Objects.subclass(ContentController, {
	/**
	 * @constructor
	 */
	create: function(e) {
		var self = ContentController.create.call(this, e);
		self.nextPuzzleSetListener = null;
		return self;
	},
	
	/**
	 * @param {stats/StatisticsTracker} statsTracker
	 */
	showResults: function(statsTracker) {
		var allStats = statsTracker.getStatistics();
		var correctStats = statsTracker.getCorrectlyAnsweredStatistics();
		this.element.querySelector("#correct").innerHTML = correctStats.length;
		this.element.querySelector("#total").innerHTML = allStats.length;
	},
	
	/**
	 * @param {function()} listener Or null to remove the current listener
	 */
	setOnNextPuzzleSetListener: function(listener) {
		this.nextPuzzleSetListener = listener;
	},
	
	/**
	 * @override
	 */
	onInit: function() {
		var self = this;
		self.element.querySelector("#nextPuzzleSet.button").addEventListener("click", function(event) {
			if (self.nextPuzzleSetListener !== null) {
				self.nextPuzzleSetListener();
			}
		});
	}
});
