// Package declaration
if (typeof typoglyph == "undefined") typoglyph = {};
if (typeof typoglyph.ui == "undefined") typoglyph.ui = {};


/**
 * @author jakemarsden
 */
typoglyph.ui.Drawer = {
	/**
	 * @constructor
	 */
	create: function() {
		var self = this.extend({});
		return self;
	},
	
	/**
	 * @param {Object} obj The object to draw
	 * @return {HTMLElement} The drawn object
	 * @abstract
	 */
	draw: function(obj) {
		throw "NotImplementedException";
	},
	
	
	// Utility methods
	/**
	 * @param {String} tagName
	 * @param {String} [Optional] The ID to give to the new element
	 * @param {String} [Optional] The class name to give to the new element
	 */
	newElement: function(tagName) {
		var id = (arguments.length >= 2) ? arguments[1] : null;
		var className = (arguments.length >= 3) ? arguments[2] : null;
		
		var e = document.createElement(tagName);
		if (id !== null)
			e.id = id;
		if (className !== null)
			e.className = className;
		return e;
	},
	
	/**
	 * @param {String} text
	 */
	newTextNode: function(text) {
		return document.createTextNode(text);
	}
};


/**
 * Used to generate a visual representation of a list of puzzle options
 */
typoglyph.ui.PuzzleOptionBarDrawer = typoglyph.ui.Drawer.extend({
	/**
	 * @param {PuzzleOptionDrawer} optionDrawer
	 * @constructor
	 */
	create: function(optionDrawer) {
		var self = typoglyph.ui.Drawer.create.call(this);
		self.optionDrawer = optionDrawer;
		return self;
	},
	
	/**
	 * @param {Array<Option>} options
	 * @return {HTMLElement}
	 */
	draw: function(options) {
		var table = this.newElement("table");
		var row = this.newElement("tr");
		for (var i = 0; i < options.length; i++) {
			var drawnOption = this.optionDrawer.draw(options[i]);
			var td = this.newElement("td");
			td.appendChild(drawnOption);
			row.appendChild(td);
		}		
		table.appendChild(row);
		return table;
	}
});


/**
 * Used to generate a visual representation of a Typoglyph puzzle
 * 
 * @author jakemarsden
 */
typoglyph.ui.PuzzleDrawer = typoglyph.ui.Drawer.extend({
	/**
	 * @param {PuzzleGapDrawer} gapDrawer
	 * @constructor
	 */
	create: function(gapDrawer) {
		var self = typoglyph.ui.Drawer.create.call(this);
		self.gapDrawer = gapDrawer;
		return self;
	},
	
	draw: function(puzzle) {
		var e = this.newElement("span", "", "puzzle");
		var sentenceFragment = null;
		
		// Iterate length+1 in case there's a gap after the last character
		for (var i = 0; i < puzzle.sentence.length + 1; i++) {
			
			var gap = puzzle.getGapAtPosition(i);
			if (gap !== null) {
				var sentenceFragment = null; // a new one will be started for the next character
				var drawnGap = this.gapDrawer.draw(gap);
				e.appendChild(drawnGap);
			}
			
			// Start a new sentence fragment if necessary
			if (sentenceFragment === null) {
				sentenceFragment = this.newTextNode("");
				e.appendChild(sentenceFragment);
			}
			// Append character to the sentence fragment
			sentenceFragment.textContent += puzzle.sentence.charAt(i);
		}
		return e;
	}
});


/**
 * Used to generate a visual representation of a puzzle gap
 * 
 * @author jakemarsden
 */
typoglyph.ui.PuzzleGapDrawer = typoglyph.ui.Drawer.extend({
	/**
	 * @param {PuzzleOptionDrawer} optionDrawer
	 * @param {boolean} showSolution True if you want the solution to be shown, false if you want
	 *     the current choice to be shown
	 * @constructor
	 */
	create: function(optionDrawer, showSolution) {
		var self = typoglyph.ui.Drawer.create.call(this);
		self.optionDrawer = optionDrawer;
		self.showSolution = showSolution;
		return self;
	},
	
	/**
	 * @param {Gap} gap
	 * @return {HTMLElement}
	 * @override
	 */
	draw: function(gap) {
		var id = "puzzleGap-" + gap.id;
		var e = this.newElement("span", id, "puzzleGap");
		
		var option = (this.showSolution) ? gap.solution : gap.currentChoice;
		if (option !== null) {
			var drawnOption = this.optionDrawer.draw(option);
			e.appendChild(drawnOption);
		}
		return e;
	}
});


/**
 * Used to generate a visual representation of a puzzle option
 * 
 * @author jakemarsden
 */
typoglyph.ui.PuzzleOptionDrawer = typoglyph.ui.Drawer.extend({
	/**
	 * @constructor
	 */
	create: function() {
		return typoglyph.ui.Drawer.create.call(this);
	},
	
	/**
	 * @param {Option} option
	 * @return {HTMLElement}
	 * @override
	 */
	draw: function(option) {
		var id = "puzzleOption-" + option.id;
		var e = this.newElement("span", id, "puzzleOption");
		e.appendChild(this.newTextNode(option.value));
		return e;
	}
});


/**
 * @author jakemarsden
 */
typoglyph.ui.ProgressBarDrawer = typoglyph.ui.Drawer.extend({
	/**
	 * @param {int} setSize How many puzzles to expect in each set of puzzles
	 * @constructor
	 */
	create: function(setSize) {
		var self = typoglyph.ui.Drawer.create.call(this);
		self.setSize = setSize;
		return self;
	},
	
	/**
	 * @param {StatisticsTracker} statsTracker Information about puzzles which have been answered so far
	 * @return {HTMLElement}
	 * @override
	 */
	draw: function(statsTracker) {
		var e = this.newElement("div", "", "progressBar");
		var stats = statsTracker.getStatistics();
		for (var i = 0; i < stats.length; i++) {
			var progress = this.newElement("span", "", (stats[i].result ? "correct" : "incorrect"));
			progress.style.width = (100 / this.setSize) + "%";
			e.appendChild(progress);
		}
		return e;
	}
});


/**
 * @author jakemarsden
 */
typoglyph.ui.CompletionGraphicDrawer = typoglyph.ui.Drawer.extend({
	/**
	 * @param {Array<String>} correctGraphics
	 * @param {Array<String>} incorrectGraphics
	 * @constructor
	 */
	create: function(correctGraphics, incorrectGraphics) {
		var self = typoglyph.ui.Drawer.create.call(this);
		self.correctGraphics = correctGraphics;
		self.incorrectGraphics = incorrectGraphics;
		return self;
	},
	
	/**
	 * @param {boolean} correct
	 * @return {HTMLElement}
	 * @override
	 */
	draw: function(correct) {
		var util = typoglyph.util;
		
		var graphic = util.randomElement(correct ? this.correctGraphics : this.incorrectGraphics);
		var e = this.newElement("img", "completionGraphic");
		e.src = graphic;
		util.setImageRotation(e, util.randomInt(-50, 50));
		
		return e;
	}
});
