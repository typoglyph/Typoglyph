require.config({
	baseUrl: "/scripts/module/",
	paths: {
		// Entry points
		admin: "../admin",
		index: "../index",
		
		// Libraries
		howler: "../lib/howler-v1.1.29/howler.min",
		interact: "../lib/interact-v1.2.6/interact.min"
	}
});

// See https://github.com/requirejs/requirejs/issues/354#issuecomment-44496216
// See http://stackoverflow.com/a/22745553/14731
var scripts = document.getElementsByTagName("script");
var thisScriptTag = scripts[scripts.length - 1];
var dataMain = thisScriptTag.getAttribute("data-main");

if (dataMain) {
    require([dataMain]);
}
