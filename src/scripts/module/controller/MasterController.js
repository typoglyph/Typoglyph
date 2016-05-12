/**
 * @author jakemarsden
 */
define(["util/Objects"], function(Objects) {
	return {
		/**
		 * @param {Array<ContentController>} controllers
		 * @constructor
		 */
		create: function(controllers) {
			var self = Objects.subclass(this, {
				controllers: controllers,
			});
			self.hideAll();
			return self;
		},
		
		/**
		 * @param {ContentController} controller The controller to show
		 */
		show: function(controller) {
			for (var i = 0; i < this.controllers.length; i++) {
				if (this.controllers[i] !== controller) {
					this.controllers[i].setVisible(false);
				}
			}
			controller.setVisible(true);
		},
		hideAll: function() {
			for (var i = 0; i < this.controllers.length; i++) {
				this.controllers[i].setVisible(false);
			}
		}
	};
});
