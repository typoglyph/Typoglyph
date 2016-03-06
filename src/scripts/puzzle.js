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
	 * @return {Array<Gap>}
	 */
	this.getGaps = function() {
		return _gaps;
	}
}


/**
 * @param {int} position
 * @param {Option} solution
 * @constructor
 * @author jakemarsden
 */
typoglyph.puzzle.Gap = function(position, solution) {
	/** @private */ var _position = position;
	/** @private */ var _solution = solution;
	/** @private */ var _currentChoice = null;
	
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


/**
 * @param {String} value
 * @constructor
 * @author jakemarsden
 */
typoglyph.puzzle.Option = function(value) {
	/** @private */ var _value = value;
	
	/**
	 * @return {String}
	 */
	this.getValue = function() {
		return _value;
	}
}
