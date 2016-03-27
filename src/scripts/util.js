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
 * @return {int}
 * @static
 * @author jakemarsden
 * @see https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
 */
typoglyph.util.getViewportWidth = function() {
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	if (typeof window.innerWidth != 'undefined')
		return window.innerWidth;
		
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
	if (typeof document.documentElement != 'undefined'
			&& typeof document.documentElement.clientWidth != 'undefined'
			&& document.documentElement.clientWidth != 0)
		return document.documentElement.clientWidth;
	
	// older versions of IE
	return document.getElementsByTagName('body')[0].clientWidth;
}

/**
 * @return {int}
 * @static
 * @author jakemarsden
 * @see https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
 */
typoglyph.util.getViewportHeight = function() {
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	if (typeof window.innerHeight != 'undefined')
		return window.innerHeight;
		
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
	if (typeof document.documentElement != 'undefined'
			&& typeof document.documentElement.clientHeight != 'undefined'
			&& document.documentElement.clientHeight != 0)
		return document.documentElement.clientHeight;
	
	// older versions of IE
	return document.getElementsByTagName('body')[0].clientHeight;
}

/**
 * @param {HTMLElement} e The DOM element to get the size of
 * @return {float} The width of the specified element, in pixels
 * @static
 */
typoglyph.util.getElementWidth = function(e) {
	return e.getBoundingClientRect().width;
}

/**
 * @param {HTMLElement} e The DOM element to get the size of
 * @return {float} The height of the specified element, in pixels
 * @static
 */
typoglyph.util.getElementHeight = function(e) {
	return e.getBoundingClientRect().height;
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

/**
 * Adapted from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
 *
 * @param {String} parameterName
 * @return {String}
 * @static
 * @author jakemarsden
 * @see http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
 */
typoglyph.util.getQueryParameter = function(parameterName) {
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	} 
	return query_string[parameterName];
}
