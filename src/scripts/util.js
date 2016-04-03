// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};
if (typeof typoglyph.util == 'undefined') typoglyph.util = {};


/**
 * @param {int} minimum
 * @param {int} maximum
 * @return {int} A random integer within the range [minimum, maximum]
 * @static
 */
typoglyph.util.randomInt = function(minimum, maximum) {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

/**
 * @param {Array<Object>}
 * @return {Object} An element from the given array
 * @static
 */
typoglyph.util.randomElement = function(array) {
	if (array.length === 0)
		return Null;
	var index = typoglyph.util.randomInt(0, array.length - 1);
	return array[index];
}

/**
 * @return {Rect}
 * @static
 * @author jakemarsden
 * @see https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
 */
typoglyph.util.getViewportSize = function() {
	var w;
	var h;
	if (typeof window.innerWidth != 'undefined') {
		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		w = window.innerWidth;
		h = window.innerHeight;
	} else if (typeof document.documentElement != 'undefined'
			&& typeof document.documentElement.clientWidth != 'undefined'
			&& document.documentElement.clientWidth != 0) {
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		w = document.documentElement.clientWidth;
		h = document.documentElement.clientHeight;
	} else {
		// older versions of IE
		w = document.getElementsByTagName('body')[0].clientWidth;
		h = document.getElementsByTagName('body')[0].clientHeight;
	}
	
	var rect = {
		left: 0,
		top: 0,
		right: w,
		bottom: h,
		width: w,
		height: h };
	return rect;
}

/**
 * @param {HTMLElement} e The DOM element to get the classes of
 * @return {Array<String>} The classes of the specified element
 * @static
 */
typoglyph.util.getClasses = function(e) {
	var clazzes = e.className.split(/\s+/);
	return clazzes.filter(function(item) { return item.length !== 0; });
}

/**
 * @param {HTMLElement} e The DOM element to set the classes of
 * @param {Array<String>} The classes to give to the specified element
 * @static
 */
typoglyph.util.setClasses = function(e, clazzes) {
	var str = "";
	for (var i = 0; i < clazzes.length; i++) {
		if (i !== 0)
			str += " ";
		str += clazzes[i];
	}
	e.className = str;
}

/**
 * @param {HTMLElement} e The DOM element to add the specified class to
 * @param {String} clazz The class to add to the specified element
 * @static
 */
typoglyph.util.addClass = function(e, clazz) {
	var clazzes = typoglyph.util.getClasses(e);
	clazzes.pushUnique(clazz);
	typoglyph.util.setClasses(e, clazzes);
}

/**
 * @param {HTMLElement} e The DOM element to remove the specified class from
 * @param {String} clazz The class to remove from the specified element
 * @static
 */
typoglyph.util.removeClass = function(e, clazz) {
	var clazzes = typoglyph.util.getClasses(e);
	clazzes.removeAll(clazz);
	typoglyph.util.setClasses(e, clazzes);
}

/**
 * @param {HTMLElement} e The DOM element to rotate
 * @param {float} rotation How much to rotate the image, in degrees
 * @static
 */
typoglyph.util.setImageRotation = function(e, rotation) {
	// get it in the range (0, 360]
	while (rotation < 0)
		rotation += 360;
	while (rotation >= 360)
		rotation -= 360;
	
	var s = e.style;
	var r = "rotate(" + rotation + "deg)";
	s["-webkit-transform"] = r;
	s["-moz-transform"] = r;
	s["-o-transform"] = r;
	s["-ms-transform"] = r;
	s["transform"] = r;
}

/**
 * @param {HTMLElement} e
 * @param {String} type
 * @param {function(Event, HTMLElement)} listener
 */
typoglyph.util.addOneOffEventListener = function(e, type, listener) {
	e.addEventListener(type, function(event) {
		event.target.removeEventListener(event.type, arguments.callee);
		listener(event, event.target);
	});
}

/**
 * @param {HTMLElement} e The element whose children should be removed
 */
typoglyph.util.removeAllChildren = function(e) {
	var node;
	while (node = e.firstChild)
		e.removeChild(node);
}
