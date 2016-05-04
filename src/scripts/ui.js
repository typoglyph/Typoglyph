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
		var self = Objects.subclass(this);
		return self;
	},
	
	/**
	 * Creates and returns a new DOM element which can act as the root of the drawn element for the
	 * given object.
	 * Important: This method should only ever be called from within the typoglyph.ui.Drawer class.
	 * 
	 * @param {Object} obj
	 * @return {HTMLElement}
	 * @private
	 * @abstract
	 */
	createRootElement(obj) {
		throw "NotImplementedException";
	},
	
	/**
	 * Draws the given object into a new DOM element and returns the new DOM element
	 * 
	 * @param {Object} obj The object to draw
	 * @return {HTMLElement} The drawn object
	 */
	draw: function(obj) {
		var rootE = this.createRootElement(obj);
		this.drawInto(rootE, obj);
		return rootE;
	},
	
	/**
	 * Draws the given object into the given DOM element
	 * 
	 * @param {HTMLElement} p The DOM element to draw the given object into
	 * @param {Object} obj The object to draw
	 * @abstract
	 */
	drawInto: function(p, obj) {
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
typoglyph.ui.PuzzleOptionBarDrawer = Objects.subclass(typoglyph.ui.Drawer, {
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
	 * @param {Object} obj
	 * @return {HTMLElement}
	 * @override
	 */
	createRootElement(obj) {
		var msg = "This class only supports the 'drawInto' method";
		throw "UnsupportedOperationException: " + msg;
	},
	
	/**
	 * @param {HTMLElement} p
	 * @param {Array<Option>} options
	 * @override
	 */
	drawInto: function(p, options) {
		for (var i = 0; i < options.length; i++) {
			var drawnOption = this.optionDrawer.draw(options[i]);
			p.appendChild(drawnOption);
		}
	}
});


/**
 * Used to generate a visual representation of a Typoglyph puzzle
 * 
 * @author jakemarsden
 */
typoglyph.ui.PuzzleDrawer = Objects.subclass(typoglyph.ui.Drawer, {
	/**
	 * @param {PuzzleGapDrawer} gapDrawer
	 * @constructor
	 */
	create: function(gapDrawer) {
		var self = typoglyph.ui.Drawer.create.call(this);
		self.gapDrawer = gapDrawer;
		return self;
	},
	
	/**
	 * @param {Object} obj
	 * @return {HTMLElement}
	 * @override
	 */
	createRootElement(obj) {
		var msg = "This class only supports the 'drawInto' method";
		throw "UnsupportedOperationException: " + msg;
	},
	
	/**
	 * @param {HTMLElement} p
	 * @param {Puzzle} puzzle
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


/**
 * Used to generate a visual representation of a puzzle gap
 * 
 * @author jakemarsden
 */
typoglyph.ui.PuzzleGapDrawer = Objects.subclass(typoglyph.ui.Drawer, {
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
	createRootElement: function(gap) {
		var e = this.newElement("span", "puzzleGap-" + gap.id, "puzzleGap");
		e.setAttribute("data-id", gap.id);
		return e;
	},
	
	/**
	 * @param {HTMLElement} p
	 * @param {Gap} gap
	 * @override
	 */
	drawInto: function(p, gap) {
		var option = (this.showSolution) ? gap.solution : gap.currentChoice;
		if (option !== null) {
			var drawnOption = this.optionDrawer.draw(option);
			p.appendChild(drawnOption);
		}
	}
});


/**
 * Used to generate a visual representation of a puzzle option
 * 
 * @author jakemarsden
 */
typoglyph.ui.PuzzleOptionDrawer = Objects.subclass(typoglyph.ui.Drawer, {
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
	createRootElement: function(option) {
		var e = this.newElement("span", "puzzleOption-" + option.id, "puzzleOption");
		e.setAttribute("data-id", option.id);
		return e;
	},
	
	/**
	 * @param {HTMLElement} p
	 * @param {Option} option
	 * @override
	 */
	drawInto: function(p, option) {
		p.appendChild(this.newTextNode(option.value));
	}
});


/**
 * @author jakemarsden
 */
typoglyph.ui.ProgressBarDrawer = Objects.subclass(typoglyph.ui.Drawer, {
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
	 * @param {Object} obj
	 * @return {HTMLElement}
	 * @override
	 */
	createRootElement(obj) {
		var msg = "This class only supports the 'drawInto' method";
		throw "UnsupportedOperationException: " + msg;
	},
	
	/**
	 * @param {HTMLElement} p
	 * @param {StatisticsTracker} statsTracker Information about puzzles which have been answered so far
	 * @override
	 */
	drawInto: function(p, statsTracker) {
		var stats = statsTracker.getStatistics();
		for (var i = 0; i < stats.length; i++) {
			var progress = this.newElement("span", "", (stats[i].result ? "correct" : "incorrect"));
			progress.style.width = (100 / this.setSize) + "%";
			p.appendChild(progress);
		}
	}
});


/**
 * @author jakemarsden
 */
typoglyph.ui.CompletionGraphicDrawer = Objects.subclass(typoglyph.ui.Drawer, {
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
	 * @param {Object} obj
	 * @return {HTMLElement}
	 * @override
	 */
	createRootElement(obj) {
		var msg = "This class only supports the 'drawInto' method";
		throw "UnsupportedOperationException: " + msg;
	},
	
	/**
	 * @param {HTMLElement} p
	 * @param {boolean} correct
	 * @override
	 */
	drawInto: function(p, correct) {
		var util = typoglyph.util;
		
		/*
		Problem: When setting both "transform:rotate()" in an element's style and
		    "transform:translate()" in its CSS rule, one transformation will override the other and
		    only the rotation will actually be used. Example:
		    <style>#test { transform:translate(); }</style>
			<div id="test" style="transform:rotate();" />
		Solution:
		    Wrap the element in a <div>. Apply the translation to the <div> and the rotation to the
		    element. Example:
		    <style>#test { transform:translate(); }</style>
			<div style="transform:rotate();"><div id="test"></div>
		*/
		var graphic = util.randomElement(correct ? this.correctGraphics : this.incorrectGraphics);
		var inner = this.newElement("img");		
		inner.src = graphic;
		util.setImageRotation(inner, util.randomInt(-50, 50));
		p.appendChild(inner);
	},
	
	/**
	 * Returns the given DOM element to its default state. This is usually called sometime after a
	 * call to "drawInto(p, ?)"
	 * 
	 * @param {HTMLElement} p
	 */
	reset: function(p) {
		var util = typoglyph.util;
		util.removeAllChildren(p);
	}
});


typoglyph.ui.CompletionSoundPlayer = {
	/**
	 * @param {Array<String>} correctSounds
	 * @param {Array<String>} incorrectSounds
	 * @constructor
	 */
	create: function(correctSounds, incorrectSounds) {
		var self = Objects.subclass(this);
		self.correctSounds = correctSounds;
		self.incorrectSounds = incorrectSounds;
		
		// May need to be tweaked depending on the sounds being played
		self.volume = 1.0;
		return self;
	},
	
	/**
	 * @param {boolean} correct
	 */
	playSound: function(correct) {
		var util = typoglyph.util;
		var sound = util.randomElement(correct ? this.correctSounds : this.incorrectSounds);
		this.initPlayer([sound], this.volume).play();
	},
	
	/**
	 * @private
	 */
	initPlayer: function(urls, volumne) {
		return new Howl({
			urls: urls,
			volume: this.volume,
			autoplay: false,
			loop: false,
			
			onload:			function() { console.debug("Howl.onLoad: " + urls); },
			onloaderror:	function() { console.warn("Howl.onLoadError: " + urls); },
			onplay:			function() { console.debug("Howl.onPlay: " + urls); },
			onpause:		function() { console.debug("Howl.onPause: " + urls); },
			onend:			function() { console.debug("Howl.onEnd: " + urls); }
		});
	}
}
