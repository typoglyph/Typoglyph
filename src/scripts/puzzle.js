// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};
if (typeof typoglyph.puzzle == 'undefined') typoglyph.puzzle = {};


/**
 * The process of solving a puzzle consists of populating its gaps with options. A puzzle is solved
 * correctly when all of its gaps contain the correct option.
 * 
 * @author jakemarsden
 */
typoglyph.puzzle.Puzzle = {
	/**
	 * @param {String} sentence The main part of a puzzle
	 * @param {Array<Option>} options The values which can be used to populate the puzzle's gaps
	 *     (each option can be used zero or more times)
	 * @param {Array<Gap>} gaps Represents the places in the sentence where an option can be
	 *     inserted
	 * @constructor
	 */
	create: function(sentence, options, gaps) {
		var self = this.extend({
			sentence: sentence,
			options: options,
			gaps: gaps
		});
		return self;
	},
	
	/**
	 * @param {int} id
	 * @return {Option} The option of this puzzle which has the specified ID, or null if the puzzle
	 *     doesn't have any options with that ID
	 */
	getOptionById: function(id) {
		for (var i = 0; i < this.options.length; i++) {
			if (this.options[i].id === id) {
				return this.options[i];
			}
		}
		return null;
	},
	/**
	 * @param {int} id
	 * @return {Gap} The gap of this puzzle which has the specified ID, or null if the puzzle
	 *     doesn't have any gaps with that ID
	 */
	getGapById: function(id) {
		for (var i = 0; i < this.gaps.length; i++) {
			if (this.gaps[i].id === id) {
				return this.gaps[i];
			}
		}
		return null;
	},
	/**
	 * @param {int} position
	 * @return {Gap} The gap of this puzzle which has the specified position, or null if the puzzle
	 *     doesn't have any gaps at that position
	 */
	getGapAtPosition: function(position) {
		for (var i = 0; i < this.gaps.length; i++) {
			if (this.gaps[i].position === position) {
				return this.gaps[i];
			}
		}
		return null;
	},
	
	/**
	 * @return {boolean}
	 */
	areAllGapsFilled: function() {
		for (var i = 0; i < this.gaps.length; i++) {
			if (!this.gaps[i].isFilled()) {
				return false;
			}
		}
		return true;
	},
	/**
	 * @return {boolean}
	 */
	areAllGapsFilledCorrectly: function() {
		for (var i = 0; i < this.gaps.length; i++) {
			if (!this.gaps[i].isFilledCorrectly()) {
				return false;
			}
		}
		return true;
	},
	
	/**
	 * @return {String}
	 */
	toString: function() {
		var str = "";
		for (var i = 0; i <= this.sentence.length; i++) {
			var gap = this.getGapAtPosition(i);
			if (gap !== null) {
				str += gap;
			}
			str += this.sentence.charAt(i);
		}
		return str;
	},
	/**
	 * @return {boolean}
	 */
	equals: function(other) {
		return other !== null
			&& Objects.equals(this.sentence, other.sentence)
			&& Objects.equals(this.options, other.options)
			&& Objects.equals(this.gaps, other.gaps);
	}
};

/** 
 * @param {String} json
 * @return {Array<Puzzle>}
 */
typoglyph.puzzle.Puzzle.fromJsonArray = function(json) {
	var jsonPuzzles = JSON.parse(json);
	var puzzles = [];
	for (var i = 0; i < jsonPuzzles.length; i++) {
		var jsonPuzzle = jsonPuzzles[i];
		var jsonGaps = jsonPuzzle.gaps;
		var jsonOptions = jsonPuzzle.options;
		var gaps = [];
		var options = [];
		for (var j = 0; j < jsonGaps.length; j++) {
			var jsonGap = jsonGaps[j];
			var solution = (jsonGap.solution === null) ? null : typoglyph.puzzle.Option.create(jsonGap.solution.value);
			var gap = typoglyph.puzzle.Gap.create(jsonGap.position, solution);
			if (jsonGap.currentChoice !== null) {
				gap.currentChoice = typoglyph.puzzle.Option.create(jsonGap.currentChoice.value);
			}
			gaps.push(gap);
		}
		for (var j = 0; j < jsonOptions.length; j++) {
			var jsonOption = jsonOptions[j];
			var option = typoglyph.puzzle.Option.create(jsonOption.value);
			options.push(option);
		}
		var puzzle = typoglyph.puzzle.Puzzle.create(jsonPuzzle.sentence, options, gaps);
		puzzles.push(puzzle);
	}
	return puzzles;
}


/**
 * A gap represents a space within a puzzle's sentence which can be filled in with an option. An
 * option is filled correctly when its solution matches the current choice.
 * 
 * @author jakemarsden
 */
typoglyph.puzzle.Gap = {
	/**
	 * @param {int} position Where in a puzzle this gap should lie:
	 *     0: just before the first character of a puzzle's sentence
	 *     1: just after the first character of a puzzle's sentence
	 *     sentence.length: just after the last character of a puzzle's sentence
	 * @param {Option} solution The value this gap must be filled with if it is to be considered
	 *     "correct". If null, the gap will be correct if it hasn't been filled.
	 * @constructor
	 */
	create: function(position, solution) {
		var self = this.extend({
			id: typoglyph.puzzle.Gap.nextId++,
			position: position,
			solution: solution,
			currentChoice: null
		});
		return self;
	},
	
	/**
	 * @return {boolean}
	 */
	isFilled: function() {
		return this.currentChoice !== null;
	},
	/**
	 * @return {boolean}
	 */
	isFilledCorrectly: function() {
		return Objects.equals(this.currentChoice, this.solution);
	},
	
	/**
	 * @return {String}
	 */
	toString: function() {
		return "{" + (this.solution === null ? "" : this.solution) + "}";
	},
	/**
	 * @param {Gap} other
	 * @return {boolean}
	 */
	equals: function(other) {
		return other !== null
			&& Objects.equals(this.position, other.position)
			&& Objects.equals(this.solution, other.solution)
			&& Objects.equals(this.currentChoice, other.currentChoice);
	}
};
typoglyph.puzzle.Gap.nextId = 0;


/**
 * A value which can be used to populate one of the gaps of a puzzle 
 * 
 * @author jakemarsden
 */
typoglyph.puzzle.Option = {
	/**
	 * @param {String} value
	 * @constructor
	 */
	create: function(value) {
		var self = this.extend({
			id: typoglyph.puzzle.Option.nextId++,
			value: value
		});
		return self;
	},
	
	/**
	 * @return {String} toString
	 */
	toString: function() {
		return this.value;
	},
	/**
	 * @param {Option} other
	 * @return {boolean}
	 */
	equals: function(other) {
		return other !== null
			&& Objects.equals(this.value, other.value);
	}
};
typoglyph.puzzle.Option.nextId = 0;
