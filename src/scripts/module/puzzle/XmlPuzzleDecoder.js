/**
 * @author jakemarsden
 * @see XmlPuzzleEncoder
 */
define([
    "./Character",
    "./Gap",
    "./Option",
    "./Puzzle"
], function (Character, Gap, Option, Puzzle) {

    return {
        /**
         * This function is compatible with XmlPuzzleEncoder#toXml
         * <p>
         * Example input:
         * <pre>
         * <?xml version="1.0" encoding="UTF-8"?>
         * <puzzle>
         *   <id>1</id>
         *   <sentenceFragments>
         *     <character>H</character>
         *     <character>e</character>
         *     <character>l</character>
         *     <character>l</character>
         *     <character>o</character>
         *     <gap />
         *     <character>w</character>
         *     <character>o</character>
         *     <character>r</character>
         *     <character>l</character>
         *     <character>d</character>
         *     <gap>
         *     <solution>!</solution>
         *     </gap>
         *   </sentenceFragments>
         *   <options>
         *     <option>.</option>
         *     <option>,</option>
         *     <option>!</option>
         *     <option>?</option>
         *   </options>
         * </puzzle>
         * </pre>
         *
         * @param {String} xml
         * @return {Puzzle}
         */
        fromXml: function (xml) {
            var encodedPuzzle = stringToXmlDoc(xml).documentElement;
            return decodePuzzle(encodedPuzzle);
        },

        /**
         * This function is compatible with XmlPuzzleEncoder#toXmlArray
         * <p>
         * Example input:
         * <pre>
         * <?xml version="1.0" encoding="UTF-8"?>
         * <puzzles>
         *   <puzzle>
         *     <id>1</id>
         *     <sentenceFragments>
         *       <character>H</character>
         *       <character>e</character>
         *       <character>l</character>
         *       <character>l</character>
         *       <character>o</character>
         *       <gap />
         *       <character>w</character>
         *       <character>o</character>
         *       <character>r</character>
         *       <character>l</character>
         *       <character>d</character>
         *       <gap>
         *       <solution>!</solution>
         *       </gap>
         *     </sentenceFragments>
         *     <options>
         *       <option>.</option>
         *       <option>,</option>
         *       <option>!</option>
         *       <option>?</option>
         *     </options>
         *   </puzzle>
         *   <!-- ...more puzzle definitions -->
         * </puzzles>
         * </pre>
         *
         * @param {String} xml
         * @return {Array<Puzzle>}
         */
        fromXmlArray: function (xml) {
            var encodedPuzzles = stringToXmlDoc(xml).documentElement.children;
            var decodedPuzzles = [];
            for (var i = 0; i < encodedPuzzles.length; i++) {
                var decodedPuzzle = decodePuzzle(encodedPuzzles[i]);
                decodedPuzzles.push(decodedPuzzle);
            }
            return decodedPuzzles;
        }
    };


    /**
     * <code>Puzzle#sentenceFragments</code> can contain instances of a mixture of different
     * <code>SentenceFragment</code> subclasses. This is why the <code>"type"</code> attribute has
     * been added to the JSON. Currently only <code>Character</code> and <code>Gap</code> instances
     * can be decoded.
     *
     * @param {Element} xml
     * @return {Puzzle}
     */
    function decodePuzzle(xml) {
        if (xml === null) {
            return null;
        }

        var decodedId = xml.getElementsByTagName("id")[0].firstChild.nodeValue;
        decodedId = parseInt(decodedId);

        var /** Array<SentenceFragment> */ decodedFragments = [];
        var /** Array<Element> */ encodedFragments = xml.getElementsByTagName("sentenceFragments")[0].children;
        var i;
        for (i = 0; i < encodedFragments.length; i++) {
            var decodedFragment = decodeSentenceFragment(encodedFragments[i]);
            decodedFragments.push(decodedFragment);
        }

        var /** Array<Option> */ decodedOptions = [];
        var /** Array<Element> */ encodedOptions = xml.getElementsByTagName("options")[0].children;
        for (i = 0; i < encodedOptions.length; i++) {
            var decodedOption = decodeOption(encodedOptions[i]);
            decodedOptions.push(decodedOption);
        }

        return Puzzle.create(decodedId, decodedFragments, decodedOptions);
    }

    /**
     * Example input: <character>x</character>
     * Example input: <gap><solution>!</solution></gap>
     *
     * @param {Element} xml
     * @return {SentenceFragment}
     */
    function decodeSentenceFragment(xml) {
        if (xml === null) {
            return null;

        } else if (xml.nodeName.toLowerCase() === "character") {
            return Character.create(xml.firstChild.nodeValue);

        } else if (xml.nodeName.toLowerCase() === "gap") {
            var decodedSolution = null;
            var encodedSolutions = xml.getElementsByTagName("solution");
            if (encodedSolutions.length > 0) {
                decodedSolution = decodeOption(encodedSolutions[0]);
            }
            return Gap.create(decodedSolution);
            
        } else {
            throw "Unsupported SentenceFragment type: " + xml.nodeName;
        }
    }

    /**
     * Example input: <option>!</option>
     *
     * @param {Element} xml
     * @return {Option}
     */
    function decodeOption(xml) {
        return (xml === null) ? null : Option.create(xml.firstChild.nodeValue);
    }
    
    /**
     * @param {string} xmlStr
     * @return {Document}
     * @see http://stackoverflow.com/questions/649614/xml-parsing-of-a-variable-string-in-javascript#answer-8412989
     */
    function stringToXmlDoc(xmlStr) {
        if (typeof window.DOMParser != "undefined") {
            var parser = new window.DOMParser();
            return parser.parseFromString(xmlStr, "text/xml");
        }

        // God dammit IE
        if (typeof window.ActiveXObject != "undefined") {
            var activeXDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            if (activeXDoc) {
                activeXDoc.async = "false";
                activeXDoc.loadXML(xmlStr);
                return activeXDoc;
            }
        }

        throw new Error("No XML parser found");
    }
});
