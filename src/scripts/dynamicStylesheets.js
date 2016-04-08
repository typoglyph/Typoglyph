// Package declaration
if (typeof typoglyph == 'undefined') typoglyph = {};


/**
 * Provides an easier way of dealing with multiple dynamic stylesheets. Also provides a nice way of
 * parsing dynamic stylesheets from a given DOM document, based on the class names of the elements.
 * 
 * @author jakemarsden
 * @see DynamicStylesheet
 */
typoglyph.DynamicStylesheets = {
	/**
	 * Finds all stylesheets in the given document which have the class "dynamic-stylesheet" and
	 * uses them to create some dynamic stylesheets
	 * 
	 * @param {HTMLDocument} doc
	 * @constructor
	 */
	fromDocument: function(doc) {
		var stylesheets = [];
		var styles = doc.getElementsByTagName("style");
		for (var i = 0; i < styles.length; i++)
			stylesheets.push(styles[i]);
		
		var links = doc.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++)
			if (links[i].rel.toLowerCase() === "stylesheet")
				stylesheets.push(links[i]);
		
		stylesheets = stylesheets.filter(function(item) {
			return typoglyph.util.getClasses(item).contains("dynamic-stylesheet");
		});
		
		var self = typoglyph.DynamicStylesheets.fromElements(stylesheets);
		return self;
	},
	
	/**
	 * @param {Array<HTMLElement>} elements
	 * @constructor
	 */
	fromElements(elements) {
		var dynamicStylesheets = [];
		for (var i = 0; i < elements.length; i++) {
			var dynamicStylesheet = typoglyph.DynamicStylesheet.fromElement(elements[i]);
			dynamicStylesheets.push(dynamicStylesheet);
		}
		
		var self = typoglyph.DynamicStylesheets.create(dynamicStylesheets);
		return self;
	},
	
	/**
	 * @param {Array<DynamicStylesheet>} stylesheets
	 * @constructor
	 */
	create: function(stylesheets) {
		var self = Objects.subclass(this, {
			stylesheets: stylesheets
		});
		return self;
	},
	
	/**
	 * Re-checks the restrictions on these dynamic stylesheets
	 */
	update: function() {
		for (var i = 0; i < this.stylesheets.length; i++)
			this.stylesheets[i].update();
	}
};


/**
 * A stylesheet which can be enabled and disabled dynamically based on certain restrictions. For
 * example, a stylesheet can be set up to only be enabled when the viewport meets various size
 * restrictions.
 * 
 * The stylesheet will re-check its restrictions whenever you "update()" it. Generally you should
 * update it on page load and on viewport resize.
 * 
 * @author jakemarsden
 */
typoglyph.DynamicStylesheet = {
	/**
	 * The same as create(), except the restrictions will be parsed from the class name of the
	 * stylesheet element
	 *
	 * @param {HTMLElement} e The DOM element representing the stylesheet
	 * @constructor
	 */
	fromElement(e) {
		var minWidth = null;
		var maxWidth = null;
		var minHeight = null;
		var maxHeight = null;
		
		var clazzes = typoglyph.util.getClasses(e);
		for (var i = 0; i < clazzes.length; i++) {
			var clazz = clazzes[i].toLowerCase();
			var parts = clazz.split(":");
			
			if (parts.length !== 2)
				continue;
			else if (parts[0] === "min-width")
				minWidth = parseFloat(parts[1]);
			else if (parts[0] === "max-width")
				maxWidth = parseFloat(parts[1]);
			else if (parts[0] === "min-height")
				minHeight = parseFloat(parts[1]);
			else if (parts[0] === "max-height")
				maxHeight = parseFloat(parts[1]);
		}
		
		var self = typoglyph.DynamicStylesheet.create(e, minWidth, maxWidth, minHeight, maxHeight);
		return self;
	},
	/**
	 * @param {HTMLElement} e The DOM element representing the stylesheet
	 * @param {float} minWidth The narrowest the viewport can get without this stylesheet being
	 *     disabled, or null for no restriction
	 * @param {float} maxWidth The widest the viewport can get without this stylesheet being
	 *     disabled, or null for no restriction
	 * @param {float} minHeight The shortest the viewport can get without this stylesheet being
	 *     disabled, or null for no restriction
	 * @param {float} maxHeight The tallest the viewport can get without this stylesheet being
	 *     disabled, or null for no restriction
	 * @constructor
	 */
	create: function(e, minWidth, maxWidth, minHeight, maxHeight) {
		var tagName = e.tagName.toLowerCase();
		if (!(tagName === "style" || (tagName === "link" && e.rel.toLowerCase() === "stylesheet")))
			throw `Not a stylesheet: '${e.outerHTML}'`;
		if (minWidth !== null && maxWidth !== null && minWidth > maxWidth)
			throw `minWidth cannot be greater than maxWidth: ${minWidth} > ${maxWidth}`;
		if (minHeight !== null && maxHeight !== null && minHeight > maxHeigth)
			throw `minHeight cannot be greater than maxHeight: ${minHeight} > ${maxHeight}`;
		
		var self = Objects.subclass(this, {
			element: e,
			minWidth: minWidth,
			maxWidth: maxWidth,
			minHeight: minHeight,
			maxHeight: maxHeight });
		return self;
	},
	
	/**
	 * Re-checks the restrictions set on this stylesheet and enables/disables it as required
	 */
	update: function() {
		var enabled = true;
		var bounds = typoglyph.util.getViewportSize();
		if (this.minWidth !== null && bounds.width < this.minWidth)
			enabled = false;
		if (this.maxWidth !== null && bounds.width > this.maxWidth)
			enabled = false;
		if (this.minHeight !== null && bounds.height < this.minHeight)
			enabled = false;
		if (this.maxHeight !== null && bounds.height > this.maxHeight)
			enabled = false;
		this.element.disabled = !enabled;
	}
};
