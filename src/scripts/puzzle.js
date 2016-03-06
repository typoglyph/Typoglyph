// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};
if (typeof typoglyph.puzzle == 'undefined') typoglyph.puzzle = {};


/**
 * @param {String} sentence
 * @param {Array<Option>} options
 * @param {Array<Gap>} gaps
 * @constructor
 * @author jakemarsden
 */
typoglyph.puzzle.Puzzle = function(sentence, options, gaps) {
	/** @private */ var _sentence = sentence;
	/** @private */ var _options = options;
	/** @private */ var _gaps = gaps
	
	/**
	 * @return {String}
	 */
	this.getSentence = function() {
		return _sentence;
	}
	
	/**
	 * @return {Array<Option>}
	 */
	this.getOptions = function() {
		return _options;
	}
	
	/**
	 * @param {int} optionId
	 * @return {Option}
	 */
	 this.getOptionById = function(optionId) {
		 var options = _options;
		 for (i = 0; i < options.length; i++) {
			 var option = options[i];
			 if (option.getId() === optionId)
				return option;
		 }
		 return null;
	 }
	
	/**
	 * @return {Array<Gap>}
	 */
	this.getGaps = function() {
		return _gaps;
	}
	
	/**
	 * @param {int} gapId
	 * @return {Gap}
	 */
	 this.getGapById = function(gapId) {
		 var gaps = _gaps;
		 for (i = 0; i < gaps.length; i++) {
			 var gap = gaps[i];
			 if (gap.getId() === gapId)
				 return gap;
		 }
		 return null;
	 }
}


/**
 * @param {int} position
 * @param {Option} solution
 * @constructor
 * @author jakemarsden
 */
typoglyph.puzzle.Gap = function(position, solution) {
	/** @private */ var _id = typoglyph.puzzle.Gap._nextId++;
	/** @private */ var _position = position;
	/** @private */ var _solution = solution;
	/** @private */ var _currentChoice = null;
	
	/**
	 * @return {int}
	 */
	this.getId = function() {
		return _id;
	}
	
	/**
	 * Returns where abouts this gap lies in a puzzle's sentence:
	 *     0               = Just before the first character of the sentence
	 *     1               = Just after the first character of the sentence
	 *     sentence.length = Just after the last character of the sentence
	 *
	 * @return {int}
	 */
	this.getPosition = function() {
		return _position;
	}
	
	/**
	 * @return {Option}
	 */
	this.getSolution = function() {
		return _solution;
	}
	
	/**
	 * @return {Option}
	 */
	this.getCurrentChoice = function() {
		return _currentChoice;
	}
	
	/**
	 * @param {Option} newChoice
	 */
	this.setCurrentChoice = function(newChoice) {
		_currentChoice = newChoice;
	}
}
/** @private */ typoglyph.puzzle.Gap._nextId = 0;


/**
 * @param {String} value
 * @constructor
 * @author jakemarsden
 */
typoglyph.puzzle.Option = function(value) {
	/** @private */ var _id = typoglyph.puzzle.Option._nextId++;
	/** @private */ var _value = value;
	
	/**
	 * @return {int}
	 */
	this.getId = function() {
		return _id;
	}
	
	/**
	 * @return {String}
	 */
	this.getValue = function() {
		return _value;
	}
}
/** @private */ typoglyph.puzzle.Option._nextId = 0;
