/**
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	return {
		/**
		 * @param {HTMLElement} e The element representing the content
		 * @constructor
		 */
		create: function(e) {
			var self = Objects.subclass(this, {
				element: e,
				initialized: false
			});
			return self;
		},
		
		/**
		 * @return {boolean}
		 */
		isVisible: function() {
			return (this.element.style.display !== "none");
		},
		/**
		 * @param {boolean} newValue
		 */
		setVisible: function(newValue) {
			var oldValue = this.isVisible();
			if (oldValue !== newValue) {
				if (newValue) {
					if (!this.initialized) {
						this.onInit();
						this.initialized = true;
					}
					this.onPrepare();
				}
				this.element.style.display = (newValue) ? "initial" : "none";
				if (this.initialized) this.onVisibilityChanged(oldValue, newValue);
				if (!newValue && this.initialized) this.onDestroy();
			}
		},
		toggleVisibility: function() {
			this.setVisible(!this.isVisible());
		},
		
		/**
		 * Can be overridden by subclasses. Called just before the very first onPrepare().
		 */
		onInit: function() {
		},
		/**
		 * Can be overridden by subclasses. Called just before the element is shown.
		 */
		onPrepare: function() {
		},
		/**
		 * Can be overridden by subclasses. Called just after the element is hidden.
		 */
		onDestroy: function() {
		},
		/**
		 * Can be overridden by subclasses. Called just after the element has been shown or hidden.
		 * 
		 * @param {boolean} oldValue If it was visible before the change
		 * @param {boolean} newValue If it is visible now
		 */
		onVisibilityChanged: function(oldValue, newValue) {
		}
	};
});
