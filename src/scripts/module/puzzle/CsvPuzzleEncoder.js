/**
 * @author jakemarsden
 * @see CsvPuzzleDecoder
 */
define([
    "jquery-csv",
    "./Character",
    "./Gap",
    "util/Objects"
], function (jQueryCsv, Character, Gap, Objects) {

    return {
        /**
         * The output of this function is compatible with CsvPuzzleDecoder#fromCsvArray
         * <p>
         * Note: There is no CsvPuzzleDecoder#fromCsv
         *
         * @param {Puzzle} puzzle
         * @param {string=} separator
         * @param {string=} delimiter
         * @return {String}
         */
        toCsv: function (puzzle, separator, delimiter) {
            return this.toCsvArray([puzzle], separator, delimiter);
        },

        /**
         * The output of this function is compatible with CsvPuzzleDecoder#fromCsvArray
         *
         * @param {Array<Puzzle>} puzzles
         * @param {string=} separator
         * @param {string=} delimiter
         * @return {String}
         */
        toCsvArray: function (puzzles, separator, delimiter) {
            var options = {
                separator: separator || jQueryCsv.defaults.separator,
                delimiter: delimiter || jQueryCsv.defaults.delimiter
            };

            var headers = ["ID", "Sentence", "Options"];
            var encodedPuzzles = [headers];
            for (var i = 0; i < puzzles.length; i++) {
                var encodedPuzzle = encodePuzzle(puzzles[i]);
                encodedPuzzles.push(encodedPuzzle);
            }
            return jQueryCsv.fromArrays(encodedPuzzles, options);
        }
    };


    /**
     * The resulting array will consist of:
     *   Index 0: ID
     *   Index 1: Sentence
     *   Index 2+: Options
     *
     * @param {Puzzle} puzzle
     * @return {Array<*>}
     */
    function encodePuzzle(puzzle) {
        if (puzzle === null) {
            return null;
        }
        
        var encodedPuzzle = [
            "" + puzzle.id,
            encodeSentenceFragments(puzzle.sentenceFragments)
        ];
        for (var i = 0; i < puzzle.options.length; i++) {
            var encodedOption = encodeOption(puzzle.options[i]);
            encodedPuzzle.push(encodedOption);
        }
        return encodedPuzzle;
    }

    /**
     * @param {Array<SentenceFragment>} fragments
     * @return {String}
     */
    function encodeSentenceFragments(fragments) {
        /**
         * @param {String} str
         * @return {String}
         */
        function encode(str) {
            var encoded = "";
            for (var i = 0; i < str.length; i++) {
                var char = str.charAt(i);
                switch (char) {
                    case "\\":
                    case "{":
                    case "}":
                        // Prepend with escape char
                        encoded += "\\";
                }
                encoded += char;
            }
            return encoded;
        }

        var str = "";
        for (var i = 0; i < fragments.length; i++) {
            var frag = fragments[i];
            if (Objects.isInstanceOf(frag, Character)) {
                str += encode(frag.value);

            } else if (Objects.isInstanceOf(frag, Gap)) {
                str += "{";
                if (frag.solution !== null) {
                    str += encode(frag.solution.value);
                }
                str += "}";

            } else {
                throw new Error("Unknown SentenceFragment type [" + i + "]: " + frag);
            }
        }
        return str;
    }

    /**
     * @param {Option} option
     * @return {String}
     */
    function encodeOption(option) {
        return option.value;
    }
});
