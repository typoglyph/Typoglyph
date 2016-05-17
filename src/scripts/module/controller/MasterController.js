/**
 * A set of content controllers. The general idea is to have a layout something like:
 * <code>
 * <div id="masterContent">
 *     <div id="content1">...</div>
 *     <div id="content2">...</div>
 *     ...
 * </div>
 * </code>
 * 
 * And define a controller subclass for each content controller. Then in your main script for the
 * page:
 * <code>
 * var content1 = ContentController1.create(#content1);
 * var content2 = ContentController2.create(#content2);
 * var masterController = MasterController.create([content1, content2]);
 * </code>
 * 
 * You can now switch between the shown content using:
 * <code>
 * masterController.show(content1);
 * masterController.show(content2);
 * </code>
 * 
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
