/**
 * @author jakemarsden
 */
define([
    "puzzle/CsvPuzzleEncoder",
    "puzzle/PuzzleEncoder",
    "puzzle/XmlPuzzleEncoder",
    "util/Objects",
    "./ContentController"
], function (CsvPuzzleEncoder, PuzzleEncoder, XmlPuzzleEncoder, Objects, ContentController) {

    return Objects.subclass(ContentController, {
        /**
         * @constructor
         */
        create: function (e) {
            var self = ContentController.create.call(this, e);
            self.puzzles = null;
            return self;
        },

        /**
         * @param {Array<puzzle/Puzzle>} puzzles
         */
        showPuzzles: function (puzzles) {
            this.puzzles = puzzles;
            this.updateExportPreview();
        },

        /**
         * @private
         */
        updateExportPreview: function () {
            var puzzles = this.puzzles;
            if (puzzles === null) {
                // Can't show what hasn't been given to us yet
                return;
            }

            var csvRadio = this.element.querySelector("input#exportTypeCsv");
            //var jsonRadio = this.element.querySelector("input#exportTypeJson");
            var xmlRadio = this.element.querySelector("input#exportTypeXml");

            var /** String */ encodedPuzzles = null;
            if (csvRadio.checked) {
                encodedPuzzles = CsvPuzzleEncoder.toCsvArray(puzzles);
            } else if (xmlRadio.checked) {
                encodedPuzzles = XmlPuzzleEncoder.toXmlArray(puzzles, true);
            } else /*if (jsonRadio.checked)*/ {
                encodedPuzzles = PuzzleEncoder.toJsonArray(puzzles, true);
            }

            var textArea = this.element.querySelector("textarea#exportPreview");
            textArea.value = encodedPuzzles;
        },

        /**
         * @override
         */
        onInit: function () {
            var self = this;

            var onCheckboxChangeListener = function (event) {
                if (event.target.checked) {
                    // Only do it when checked or we'll end up doing the same thing twice in a row
                    self.updateExportPreview();
                }
            };
            self.element.querySelector("input#exportTypeCsv").addEventListener("change", onCheckboxChangeListener);
            self.element.querySelector("input#exportTypeJson").addEventListener("change", onCheckboxChangeListener);
            self.element.querySelector("input#exportTypeXml").addEventListener("change", onCheckboxChangeListener);

            self.element.querySelector("#exportCopyToClip").addEventListener("click", function (event) {
                if (self.puzzles === null) {
                    // Nothing to copy
                    return;
                }

                console.debug("[#exportCopyToClip].click: event=" + event);

                // See: http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript#answer-30810322
                var textArea = self.element.querySelector("textarea#exportPreview");
                textArea.select();
                try {
                    var success = document.execCommand("copy");
                    if (!success) {
                        console.info("Unable to copy to the clipboard")
                    }
                } catch (err) {
                    console.warn("Unable to copy to the clipboard: ", err);
                }
            });

            var exportLink = this.element.querySelector("#doExportBtn");
            exportLink.addEventListener("click", function (event) {
                if (self.puzzles === null) {
                    // Nothing to export
                    return;
                }

                console.debug("[#doExportBtn].click: event=" + event);

                var csvRadio = self.element.querySelector("input#exportTypeCsv");
                //var jsonRadio = self.element.querySelector("input#exportTypeJson");
                var xmlRadio = self.element.querySelector("input#exportTypeXml");

                var format = null;
                if (csvRadio.checked) {
                    format = "csv";
                } else if (xmlRadio.checked) {
                    format = "xml";
                } else /*if (jsonRadio.checked)*/ {
                    format = "json";
                }

                var textArea = self.element.querySelector("textarea#exportPreview");
                exportLink.href = "data:Application/octet-stream,";
                exportLink.href += encodeURIComponent(textArea.value);
                exportLink.download = "typoglyph-puzzles-export." + format;
            });
        },

        /**
         * @override
         */
        onDestroy: function () {
            this.puzzles = null;
        }
    });
});
