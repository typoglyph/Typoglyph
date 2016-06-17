/**
 * @author jakemarsden
 * @see CsvPuzzleEncoder
 */
define([
    "jquery-csv",
    "./Character",
    "./Gap",
    "./Option",
    "./Puzzle"
], function (jQueryCsv, Character, Gap, Option, Puzzle) {

    return {
        /**
         * Compatible with CsvPuzzleEncoder#toCsv and CsvPuzzleEncoder#toCsvArray
         *
         * @param {String} csv
         * @param {string=} separator
         * @param {string=} delimiter
         * @return {Array<Puzzle>}
         */
        fromCsvArray: function (csv, separator, delimiter) {
            var options = {
                separator: separator || jQueryCsv.defaults.separator,
                delimiter: delimiter || jQueryCsv.defaults.delimiter
            };

            var dataArray = jQueryCsv.toArrays(csv, options);
            if (isHeaderRow(dataArray[0])) {
                dataArray.splice(0, 1); // Remove it
            }
            var decodedPuzzles = [];
            for (var i = 0; i < dataArray.length; i++) {
                var decodedPuzzle = decodePuzzle(dataArray[i]);
                decodedPuzzles.push(decodedPuzzle);
            }
            return decodedPuzzles;
        }
    };


    /**
     * Expected input contains:
     *   Index 0: ID
     *   Index 1: Sentence
     *   Index 2+: Options
     *
     * @param {Array<String>} data
     * @return {Puzzle}
     */
    function decodePuzzle(data) {
        if (data === null) {
            return null;
        }

        var decodedId = parseInt(data[0]);
        var decodedFragments = decodeSentenceFragments(data[1]);

        var decodedOptions = [];
        for (var i = 2; i < data.length; i++) {
            var decodedOption = decodeOption(data[i]);
            decodedOptions.push(decodedOption);
        }

        return Puzzle.create(decodedId, decodedFragments, decodedOptions);
    }

    /**
     * @param {String} sentence
     * @return {Array<SentenceFragment>}
     */
    function decodeSentenceFragments(sentence) {
        var decodedFrags = [];
        var escaped = false;
        var currentGap = null;
        for (var i = 0; i < sentence.length; i++) {
            var char = sentence.charAt(i);
            if (char === "\\" && !escaped) {
                escaped = true;
                continue; // Skip resetting the flag so it takes effect next iteration

            } else if (char === "{" && !escaped) {
                if (currentGap !== null) {
                    console.warn("Unescaped character '" + char + "' found inside curly braces: " + sentence);
                    console.warn("It will be treated as part of the solution");
                    if (currentGap.solution === null) {
                        currentGap.solution = Option.create("");
                    }
                    currentGap.solution.value += char;
                } else {
                    // Leave the solution null for now (it could be an empty set of braces: {})
                    currentGap = Gap.create(null);
                    decodedFrags.push(currentGap);
                }

            } else if (char === "}" && !escaped) {
                if (currentGap === null) {
                    console.warn("Unescaped character '" + char + "' found outside curly braces: " + sentence);
                    console.warn("It will be treated as an ordinary character");
                    decodedFrags.push(Character.create(char));
                } else {
                    // Just reset it as it's already been added to the array
                    currentGap = null;
                }

            } else {
                if (currentGap === null) {
                    // Not inside a gap so must be an ordinary character
                    decodedFrags.push(Character.create(char));
                } else {
                    // Inside a gap so must be part of the solution
                    if (currentGap.solution === null) {
                        currentGap.solution = Option.create("");
                    }
                    currentGap.solution.value += char;
                }
            }
            escaped = false;
        }

        return decodedFrags;
    }

    /**
     * @param {String} value
     * @return {Option}
     */
    function decodeOption(value) {
        return Option.create(value);
    }

    /**
     * @param {Array<*>} row
     * @return {boolean}
     */
    function isHeaderRow(row) {
        return row.length >= 3
            && row[0].toLowerCase() === "id"
            && row[1].toLowerCase() === "sentence"
            && row[2].toLowerCase() === "options";
    }
});
