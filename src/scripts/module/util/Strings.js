/**
 * @author jakemarsden
 */
define([], function() {
    return {
        /**
         * @param {String} str
         * @param {String} searchString
         * @param {int} [position]
         * @return {boolean}
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
         */
        endsWith: function(str, searchString, position) {
            var subjectString = str.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    };
});
