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
		for (var i = 0; i < options.length; i++) {
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
		for (var i = 0; i < gaps.length; i++) {
			var gap = gaps[i];
			if (gap.getId() === gapId)
				return gap;
		}
		return null;
	}
	
	/**
	 * @return {String}
	 */
	this.toString = function() {
		var str = "";
		var sentence = _sentence;
		var gaps = _gaps;
		for (var i = 0; i <= sentence.length; i++) {
			for (var j = 0; j < gaps.length; j++) {
				// Is the gap at the current position?
				if (gaps[j].getPosition() === i) {
					str += gaps[j];
					break;
				}
			}
			str += sentence.charAt(i);
		}
		return str;
	}
	
	/**
	 * @param {Puzzle} other
	 * @return {boolean}
	 */
	this.equals = function(other) {
		/**
		 * @param {Array<?>} a
		 * @param {Array<?>} b
		 * @return {boolean}
		 */
		function arrayEquals(a, b) {
			if (a === null || b === null)
				return (a === b);
			if (a.length !== b.length)
				return false;
			for (var i = 0; i < a.length; i++) {
				if (a[i] === null) {
					if (b[i] !== null) {
						return false;
					}
				} else if (!a[i].equals(b[i])) {
					return false;
				}
			}
			return true;
		}
		
		return other !== null
			&& _sentence === other.getSentence()
			&& arrayEquals(_options, other.getOptions())
			&& arrayEquals(_gaps, other.getGaps());
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
	 * @return {boolean}
	 */
	this.hasCurrentChoice = function() {
		return (_currentChoice !== null);
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
	
	/**
	 * @return {String}
	 */
	this.toString = function() {
		return "{" + _solution + "}";
	}
	
	/**
	 * @param {Gap} other
	 * @return {boolean}
	 */
	this.equals = function(other) {
		return other !== null
			&& _position === other.getPosition()
			&& (_solution === null) ? (other.getSolution() === null) : _solution.equals(other.getSolution())
			&& (_currentChoice === null) ? (other.getCurrentChoice() === null) : _currentChoice.equals(other.getCurrentChoice());
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
	
	/**
	 * @return {String}
	 */
	this.toString = function() {
		return _value;
	}
	
	/**
	 * @param {Option} other
	 * @return {boolean}
	 */
	this.equals = function(other) {
		return other !== null
			&& _value === other.getValue();
	}
}
/** @private */ typoglyph.puzzle.Option._nextId = 0;
