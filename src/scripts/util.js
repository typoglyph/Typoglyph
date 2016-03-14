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
