/**
 * @author jakemarsden
 */
define(["util/Objects", "./Drawer"], function(Objects, Drawer) {
	return Objects.subclass(Drawer, {
		/**
		 * @param {string} onImage Image used to represent the button when in the "on" state
		 * @param {string} offImage Image used to represent the button when in the "off" state
		 * @constructor
		 */
		create: function(onImage, offImage) {
			var self = Drawer.create.call(this);
			self.onImage = onImage;
			self.offImage = offImage;
			self.enabled = false;
			self.stateListener = null;
			return self;
		},
		
		
		/**
		 * @param {function(boolean, boolean)}
		 */
		setOnStateChangeListener: function(listener) {
			this.stateListener = listener;
		},
		
		
		/**
		 * @return {boolean}
		 */
		isEnabled: function() {
			return this.enabled;
		},
		
		/**
		 * @param {boolean} newValue
		 */
		setEnabled: function(newValue) {
			var oldValue = this.enabled;
			
			this.enabled = newValue;
			if (this.stateListener !== null) {
				this.stateListener(oldValue, newValue);
			}
		},
		
		toggle: function() {
			this.setEnabled(!this.isEnabled());
		},
		
		
		/**
		 * @param {Object} obj Unused
		 * @return {HTMLElement}
		 * @override
		 */
		createRootElement: function(obj) {
			var e = this.newElement("img", "", "toggleButton");
			return e;
		},
		
		/**
		 * @param {HTMLElement} p
		 * @param {Object} obj Unused
		 * @override
		 */
		drawInto: function(p, obj) {
			p.src = this.isEnabled() ? this.onImage : this.offImage;
		}
	});
});
