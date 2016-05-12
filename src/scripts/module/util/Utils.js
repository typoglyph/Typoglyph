/**
 * General-purpose static utility methods. Should probably be cleaned up at some point. Some of the
 * functionallity may already be available through 3rd party libraries.
 * 
 * @author jakemarsden
 */
define(["./Arrays"], function(Arrays) {
	return {
		/**
		 * @param {int} minimum
		 * @param {int} maximum
		 * @return {int} A random integer within the range [minimum, maximum]
		 */
		randomInt: function(minimum, maximum) {
			return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
		},
		
		/**
		 * @param {Array}
		 * @return {Object} An element from the given array
		 */
		randomElement: function(array) {
			if (array.length === 0)
				return Null;
			var index = this.randomInt(0, array.length - 1);
			return array[index];
		},
		
		/**
		 * @return {Rect}		 * @see https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
		 */
		getViewportSize: function() {
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
		},

		/**
		 * @param {HTMLElement} e The DOM element to get the classes of
		 * @return {Array<String>} The classes of the specified elemen
		 */
		getClasses: function(e) {
			var clazzes = e.className.split(/\s+/);
			return clazzes.filter(function(item) { return item.length !== 0; });
		},

		/**
		 * @param {HTMLElement} e The DOM element to set the classes of
		 * @param {Array<String>} The classes to give to the specified element
		 */
		setClasses: function(e, clazzes) {
			var str = "";
			for (var i = 0; i < clazzes.length; i++) {
				if (i !== 0)
					str += " ";
				str += clazzes[i];
			}
			e.className = str;
		},

		/**
		 * @param {HTMLElement} e The DOM element to add the specified class to
		 * @param {String} clazz The class to add to the specified element
		 */
		addClass: function(e, clazz) {
			var clazzes = this.getClasses(e);
			Arrays.pushUnique(clazzes, clazz);
			this.setClasses(e, clazzes);
		},

		/**
		 * @param {HTMLElement} e The DOM element to remove the specified class from
		 * @param {String} clazz The class to remove from the specified element
		 */
		removeClass: function(e, clazz) {
			var clazzes = this.getClasses(e);
			Arrays.removeAll(clazzes, clazz);
			this.setClasses(e, clazzes);
		},

		/**
		 * @param {HTMLElement} e The DOM element to translate
		 * @param {float} deltaX How much to translate the element along the X axis
		 * @param {float} deltaY Hot much to translate the element along the Y axis
		 */
		setElementTranslation: function(e, deltaX, deltaY) {
			this.setElementTransform(e, "translate", deltaX + "px", deltaY + "px");
		},

		/**
		 * @param {HTMLElement} e The DOM element to rotate
		 * @param {float} rotation How much to rotate the image, in degrees
		 */
		setImageRotation: function(e, rotation) {
			// get it in the range (0, 360]
			while (rotation < 0)
				rotation += 360;
			while (rotation >= 360)
				rotation -= 360;
			this.setElementTransform(e, "rotate", rotation + "deg");
		},

		/**
		 * Gives the specified element the specified transform. If a transform with the same name already
		 * exists, it will be overwitten without touching other types of transforms.
		 * 
		 * @param {HTMLElement} The DOM element to transform
		 * @param {String} The name of the transform to apply (rotate, translate, scale etc.)
		 * @param [vararg] The arguments to pass to use for the transform
		 */
		setElementTransform: function(e, transformName) {
			var transform = transformName + "(";
			for (var i = 2; i < arguments.length; i++) {
				if (i !== 2) {
					transform += ",";
				}
				transform += arguments[i];
			}
			transform += ")";
			
			var existingTransform = e.style.transform;
			var regExp = "(^|\\s)" + transformName + "(\\(.*?\\))?($|\\s)";
			var newTransform = existingTransform.replace(new RegExp(regExp), "$1" + transform + "$3");
			
			if (newTransform === existingTransform) {
				// The replacement didn't do anything - there must not yet be a transform with this name
				if (newTransform.length !== 0) {
					newTransform += " ";
				}
				newTransform += transform;
			}
			
			var vendors = ["-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform", "transform"];
			for (var i = 0; i < vendors.length; i++) {
				e.style[vendors[i]] = newTransform;
			}
		},

		/**
		 * @param {HTMLElement} e
		 * @param {String} type
		 * @param {function(Event, HTMLElement)} listener
		 */
		addOneOffEventListener: function(e, type, listener) {
			e.addEventListener(type, function(event) {
				event.target.removeEventListener(event.type, arguments.callee);
				listener(event, event.target);
			});
		},

		/**
		 * @param {HTMLElement} e The element whose children should be removed
		 */
		removeAllChildren: function(e) {
			var node;
			while (node = e.firstChild)
				e.removeChild(node);
		}
	};
});
