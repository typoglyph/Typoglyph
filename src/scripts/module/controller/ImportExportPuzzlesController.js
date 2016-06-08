/**
 * @author jakemarsden
 */
define([
    "util/Config",
    "util/Objects",
    "./ContentController"
], function (Config, Objects, ContentController) {

    return Objects.subclass(ContentController, {
        /**
         * @constructor
         */
        create: function (e) {
            return ContentController.create.call(this, e);
        },

        /**
         * @override
         */
        onInit: function () {
            var self = this;

            var exportLink = this.element.querySelector("#doExportBtn");
            exportLink.addEventListener("click", function (event) {
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
                exportLink.href = Config.getBackendBaseUrl();
                exportLink.href += "getAllPuzzles.php?pretty=true&format=" + format;
                exportLink.download = "typoglyph-puzzles-export." + format;
            });
        }
    });
});
