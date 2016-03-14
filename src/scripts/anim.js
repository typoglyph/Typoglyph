// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};
if (typeof typoglyph.anim == 'undefined') typoglyph.anim = {};


/**
 * @param {HTMLElement} e The DOM element which represents the animation (usually an <image/>)
 * @param {int} duration How long the animation should last, in milliseconds
 * @constructor
 * @author jakemarsden
 */
typoglyph.anim.Animation = function(e, duration) {
	if (e === null)
		throw new Exception("Illegal element: " + e);
	if (duration < 0)
		throw new Exception("Illegal duration: " + duration);
	
	/** @private */ var _e = e;
	/** @private */ var _duration = duration;
	/** @private */ var _cancelTimeout = null;
	/** @private */ var _this = this;
	
	/**
	 * Will be called just before the animation starts.
	 * 
	 * @param {HTMLElement} e
	 */
	this.onPreStart = function(e) {};
	
	/**
	 * Will be called just after the animation has started
	 * 
	 * @param {HTMLElement} e
	 */
	this.onPostStart = function(e) {};
	
	/**
	 * Will be called just before the animation stops
	 * 
	 * @param {HTMLElement} e
	 */
	this.onPreStop = function(e) {};
	
	/**
	 * Will be called just after the animation has stopped
	 * 
	 * @param {HTMLElement} e
	 */
	this.onPostStop = function(e) {};
	
	/**
	 * @return {HTMLElement} The element being animated
	 */
	this.getElement = function() {
		return _e;
	}
	
	/**
	 * Start the animation. If it is already running, it will be canceled and then immediately
	 * restarted.
	 */
	this.start = function() {
		// If the animation is already running, cancel it immediately
		if (_cancelTimeout !== null) {
			clearTimeout(_cancelTimeout);
			_this.cancel();
		}
		
		_this.onPreStart(_e);
		_e.style.visibility = "visible";
		_cancelTimeout = setTimeout(function() {
			_this.cancel();
		}, _duration);
		_this.onPostStart(_e);
	}
	
	/**
	 * If the animation is running, it will be canceled immediately
	 */
	this.cancel = function() {
		_this.onPreStop(_e);
		_cancelTimeout = null;
		_e.style.visibility = "hidden";
		_this.onPostStop(_e);
	}
}
