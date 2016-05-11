require.config({
	baseUrl: "scripts/module",
	paths: {
		// Entry points
		admin: "../admin",
		
		// Libraries
		jquery: "../lib/jquery-v1.12.3/jquery.min"
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
