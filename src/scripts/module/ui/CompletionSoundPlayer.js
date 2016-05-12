/**
 * @author jakemarsden
 */
define(["howler", "util/Objects", "util/Utils"], function(Howler, Objects, Utils) {
	return {
		/**
		 * @param {Array<String>} correctSounds
		 * @param {Array<String>} incorrectSounds
		 * @constructor
		 */
		create: function(correctSounds, incorrectSounds) {
			var self = Objects.subclass(this);
			self.correctSounds = correctSounds;
			self.incorrectSounds = incorrectSounds;
			
			// May need to be tweaked depending on the sounds being played
			self.volume = 1.0;
			return self;
		},
		
		/**
		 * @param {boolean} correct
		 */
		playSound: function(correct) {
			var sound = Utils.randomElement(correct ? this.correctSounds : this.incorrectSounds);
			this.initPlayer([sound], this.volume).play();
		},
		
		/**
		 * @private
		 */
		initPlayer: function(urls, volumne) {
			return new Howler.Howl({
				urls: urls,
				volume: this.volume,
				autoplay: false,
				loop: false,
				
				onload:			function() { console.debug("Howl.onLoad: " + urls); },
				onloaderror:	function() { console.warn("Howl.onLoadError: " + urls); },
				onplay:			function() { console.debug("Howl.onPlay: " + urls); },
				onpause:		function() { console.debug("Howl.onPause: " + urls); },
				onend:			function() { console.debug("Howl.onEnd: " + urls); }
			});
		}
	};
});
