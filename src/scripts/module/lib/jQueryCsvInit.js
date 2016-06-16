/**
 * Basically a horrible hack so we can use jquery-csv without jquery itself. You should only ever
 * be used as a shimmed dependency of jquery-csv.
 * <p>
 * The jquery-csv library pretends to depend on jquery, which we don't really want to include in
 * this project (we haven't used it up until now, and it seems like a large framework to include
 * for the sake of this one feature). Actually, jquery-csv only uses jquery as a way of getting
 * itself into the global scope.
 * <p>
 * This simple bit of code creates a dummy jQuery object for jquery-csv to happily populate.
 * <p>
 * An alternative (cleaner) solution could probably use RequireJS's shim.init config to do a
 * similar thing. I tried getting this to work alongside amd-optimize (used as part of the
 * gulpfile.js build script) but it didn't seem to work so I went with this quick-and-dirty
 * approach.<br>
 * https://requirejs.org/docs/api.html#config-shim
 *
 * @author jakemarsden
 */
define([], function () {
    var $ = {};
    window.$ = $;
    window.jQuery = $;
    return $;
});
