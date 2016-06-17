/**
 * @author jakemarsden
 */
define([
    "puzzle/CsvPuzzleDecoder",
    "puzzle/CsvPuzzleEncoder",
    "puzzle/PuzzleDecoder",
    "puzzle/PuzzleEncoder",
    "puzzle/PuzzleManager",
    "puzzle/XmlPuzzleDecoder",
    "puzzle/XmlPuzzleEncoder",
    "util/Objects",
    "util/Strings",
    "./ContentController"
], function (CsvPuzzleDecoder, CsvPuzzleEncoder, PuzzleDecoder, PuzzleEncoder, PuzzleManager,
             XmlPuzzleDecoder, XmlPuzzleEncoder, Objects, Strings, ContentController) {

    return Objects.subclass(ContentController, {
        /**
         * @constructor
         */
        create: function (e) {
            var self = ContentController.create.call(this, e);
            self.puzzles = null;
            self.puzzlesImportedListener = null;
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
         * @param {function()} listener
         */
        setOnPuzzlesImportedListener: function (listener) {
            this.puzzlesImportedListener = listener;
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

            // ##########################
            // ## Init EXPORT controls ##
            // ##########################

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


            // ##########################
            // ## Init IMPORT controls ##
            // ##########################

            self.element.querySelector("#importFilePicker").addEventListener("change", function (event) {
                /**
                 * @param {File} file
                 * @param {String} type
                 * @return {boolean}
                 */
                function isOfType(file, type) {
                    return Strings.endsWith(file.name, type) // test file extension
                        || (new RegExp("/" + type + "$")).test(file.type); // test MIME type
                }

                var selectedFile = event.target.files[0] || null;
                console.debug("[#importFilePicker].change: file=" + selectedFile.name + ", event=" + event);

                if (selectedFile !== null) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        var textArea = self.element.querySelector("#importPreview");
                        textArea.value = reader.result;
                    };
                    reader.readAsText(selectedFile);

                    if (isOfType(selectedFile, "csv")) {
                        self.element.querySelector("input#importTypeCsv").checked = true;
                    } else if (isOfType(selectedFile, "json")) {
                        self.element.querySelector("input#importTypeJson").checked = true;
                    } else if (isOfType(selectedFile, "xml")) {
                        self.element.querySelector("input#importTypeXml").checked = true;
                    }
                }
            });

            self.element.querySelector("#doImportBtn").addEventListener("click", function (event) {

                function onPuzzlesImported() {
                    var msg = "Puzzles successfully imported";
                    console.info("Success: " + msg);
                    window.alert(msg);

                    if (self.puzzlesImportedListener !== null) {
                        self.puzzlesImportedListener();
                    }
                }

                /**
                 * @param {String} msg
                 * @param {Error=} err
                 */
                function showErrorDialog(msg, err) {
                    if (err) {
                        console.warn("Unable to parse user puzzles: " + msg, err);
                    } else {
                        console.warn("Unable to parse user puzzles: " + msg);
                    }

                    if (err) {
                        if (err.stack)
                            msg += "\n\n" + err.stack;
                        else
                        // If the stack was available, it already contained this info
                            msg += "\n\n" + err.name + ": " + err.message;
                    }
                    window.alert(msg);
                }

                console.debug("[#doImportBtn].click: event=" + event);

                var textArea = self.element.querySelector("#importPreview");
                if (!textArea.value || textArea.value.length === 0) {
                    showErrorDialog("You haven't entered any puzzles to import. Try adding some to the"
                        + " input box or using the 'Open file' option.");
                    return;
                }

                var csvRadio = self.element.querySelector("input#importTypeCsv");
                var jsonRadio = self.element.querySelector("input#importTypeJson");
                var xmlRadio = self.element.querySelector("input#importTypeXml");
                var decodedPuzzles;
                try {
                    if (csvRadio.checked) {
                        decodedPuzzles = CsvPuzzleDecoder.fromCsvArray(textArea.value);
                    } else if (jsonRadio.checked) {
                        // Puzzles will be turned back into JSON shortly but we decode them here
                        // anyway to check for bad input and so we can re-encode to a consistent
                        // format before sending to the server
                        decodedPuzzles = PuzzleDecoder.fromJsonArray(textArea.value);
                    } else if (xmlRadio.checked) {
                        decodedPuzzles = XmlPuzzleDecoder.fromXmlArray(textArea.value);
                    } else {
                        // Should never happen if radio buttons are set up correctly
                        showErrorDialog("No import format (csv, json, xml) was selected");
                        return;
                    }
                } catch (err) {
                    showErrorDialog("Unable to parse your puzzles due to an error (your puzzles may not be valid CSV/JSON/XML).", err);
                    return;
                }

                var mergeRadio = self.element.querySelector("input#importModeMerge");
                var insertRadio = self.element.querySelector("input#importModeInsert");
                var replaceRadio = self.element.querySelector("input#importModeReplace");

                var mode;
                if (mergeRadio.checked) {
                    mode = "merge";
                } else if (insertRadio.checked) {
                    mode = "insert";
                } else if (replaceRadio.checked) {
                    mode = "replace";
                } else {
                    // Should never happen if radio buttons are set up correctly
                    showErrorDialog("No import mode (merge, insert or replace) was selected");
                    return;
                }

                var areYouSure = window.confirm(
                    "Are you sure you wish to import these puzzles?"
                    + "\nThis operation cannot be reversed.");
                if (areYouSure) {
                    PuzzleManager.updatePuzzles(decodedPuzzles, mode, onPuzzlesImported);
                }
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
