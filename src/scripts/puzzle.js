// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};
if (typeof typoglyph.puzzle == 'undefined') typoglyph.puzzle = {};


/**
 * @param String sentence
 * @param Option[] options
 * @param Gap[] gaps
 */
typoglyph.puzzle.Puzzle = function(sentence, options, gaps) {
	var _sentence = sentence;
	var _options = options;
	var _gaps = gaps
	
	/**
	 * @return String sentence
	 */
	this.getSentence = function() {
		return _sentence;
	}
	
	/**
	 * @return Option[]
	 */
	this.getOptions = function() {
		return _options;
	}
	
	/**
	 * @return Gap[]
	 */
	this.getGaps = function() {
		return _gaps;
	}
}


/**
 * @param int position Where abouts the gap lies in the puzzle's sentence. See Gap.getPosition().
 * @param Option solution
 */
typoglyph.puzzle.Gap = function(position, solution) {
	var _position = position;
	var _solution = solution;
	var _currentChoice = null;
	
	/**
	 * Returns where abouts this gap lies in a puzzle's sentence:
	 *     0               = Just before the first character of the sentence
	 *     1               = Just after the first character of the sentence
	 *     sentence.length = Just after the last character of the sentence
	 *
	 * @return int
	 */
	this.getPosition = function() {
		return _position;
	}
	
	/**
	 * @return Option
	 */
	this.getSolution = function() {
		return _solution;
	}
	
	/**
	 * @return Option
	 */
	this.getCurrentChoice = function() {
		return _currentChoice;
	}
	
	/**
	 * @param Option newChoice
	 */
	this.setCurrentChoice = function(newChoice) {
		_currentChoice = newChoice;
	}
}


/**
 * @param String value
 */
typoglyph.puzzle.Option = function(value) {
	var _value = value;
	
	/**
	 * @return String
	 */
	this.getValue = function() {
		return _value;
	}
}
