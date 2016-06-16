/**
 * @author jakemarsden
 * @see XmlPuzzleDecoder
 */
define([
    "./Character",
    "./Gap",
    "util/Objects"
], function (Character, Gap, Objects) {

    return {
        /**
         * The output of this function is compatible with XmlPuzzleDecoder#fromXml
         *
         * @param {Puzzle} puzzle
         * @param {boolean=} pretty
         * @return {String}
         */
        toXml: function (puzzle, pretty) {
            pretty = pretty || false;

            var doc = document.implementation.createDocument(null, null, null);
            doc.appendChild(encodePuzzle(puzzle, doc));
            return xmlToStr(doc, pretty);
        },

        /**
         * The output of this function is compatible with XmlPuzzleDecoder#fromXmlArray
         *
         * @param {Array<Puzzle>} puzzles
         * @param {boolean=} pretty
         * @return {String}
         */
        toXmlArray: function (puzzles, pretty) {
            pretty = pretty || false;

            var doc = document.implementation.createDocument(null, null, null);
            var encodedPuzzles = doc.createElement("puzzles");
            doc.appendChild(encodedPuzzles);

            for (var i = 0; i < puzzles.length; i++) {
                var encodedPuzzle = encodePuzzle(puzzles[i], doc);
                encodedPuzzles.appendChild(encodedPuzzle);
            }
            return xmlToStr(doc, pretty);
        }
    };


    /**
     * @param {Puzzle} puzzle
     * @param {Document} doc
     * @return {Element}
     */
    function encodePuzzle(puzzle, doc) {
        if (puzzle === null) {
            return null;
        }

        var encodedId = doc.createElement("id");
        encodedId.appendChild(doc.createTextNode("" + puzzle.id));

        var encodedFragments = doc.createElement("sentenceFragments");
        var i;
        for (i = 0; i < puzzle.length(); i++) {
            var fragment = puzzle.getSentenceFragmentAt(i);
            var encodedFragment = encodeSentenceFragment(fragment, doc);
            encodedFragments.appendChild(encodedFragment);
        }

        var encodedOptions = doc.createElement("options");
        for (i = 0; i < puzzle.options.length; i++) {
            var encodedOption = encodeOption(puzzle.options[i], doc);
            encodedOptions.appendChild(encodedOption);
        }

        var encodedPuzzle = doc.createElement("puzzle");
        encodedPuzzle.appendChild(encodedId);
        encodedPuzzle.appendChild(encodedFragments);
        encodedPuzzle.appendChild(encodedOptions);
        return encodedPuzzle;
    }

    /**
     * @param {SentenceFragment} fragment
     * @param {Document} doc
     * @return {Element}
     */
    function encodeSentenceFragment(fragment, doc) {
        if (fragment === null) {
            return null;

        } else if (Objects.isInstanceOf(fragment, Character)) {
            var encodedCharacter = doc.createElement("character");
            encodedCharacter.appendChild(doc.createTextNode(fragment.value));
            return encodedCharacter;

        } else if (Objects.isInstanceOf(fragment, Gap)) {
            var encodedGap = doc.createElement("gap");
            if (fragment.solution !== null) {
                var encodedSolution = doc.createElement("solution");
                encodedSolution.appendChild(doc.createTextNode(fragment.solution.value));
                encodedGap.appendChild(encodedSolution);
            }
            return encodedGap;

        } else {
            throw "Unsupported SentenceFragment type: " + fragment;
        }
    }

    /**
     * @param {Option} option
     * @param {Document} doc
     * @return {Element}
     */
    function encodeOption(option, doc) {
        if (option === null) {
            return null;
        }

        var encodedOption = doc.createElement("option");
        encodedOption.appendChild(doc.createTextNode(option.value));
        return encodedOption;
    }

    /**
     * @param {Document} doc
     * @param {boolean} pretty
     * @return {String}
     */
    function xmlToStr(doc, pretty) {
        var str = new XMLSerializer().serializeToString(doc);
        return pretty ? formatXml(str) : str;
    }

    /**
     * @param {String} xml
     * @return {String}
     * @see https://gist.github.com/sente/1083506
     * @see https://gist.github.com/kurtsson/3f1c8efc0ccd549c9e31
     */
    function formatXml(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.toString().replace(reg, '$1\r\n$2$3');
        var pad = 0;
        var nodes = xml.split('\r\n');
        for (var n in nodes) {
            var node = nodes[n];
            var indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        }
        return formatted;
        //return formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
    }
});
