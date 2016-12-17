System.register(["./knockout-bindable", "./knockout-composition", "./knockout-custom-attribute", "./require-polyfill"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(frameworkConfig) {
        // register custom attribute
        frameworkConfig.globalResources('./knockout-custom-attribute');
        // register knockout custom binding for composition logic
        frameworkConfig.container.get(knockout_composition_1.KnockoutComposition).register();
        // register require function in window object if not available
        frameworkConfig.container.get(require_polyfill_1.RequirePolyfill).register();
        // register stopKoBindings custom binding
        knockout_custom_attribute_1.KnockoutCustomAttribute.register();
    }
    exports_1("configure", configure);
    var knockout_custom_attribute_1, knockout_composition_1, require_polyfill_1;
    var exportedNames_1 = {
        "configure": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n))
                exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (knockout_bindable_1_1) {
                exportStar_1(knockout_bindable_1_1);
            },
            function (knockout_composition_2_1) {
                exportStar_1(knockout_composition_2_1);
                knockout_composition_1 = knockout_composition_2_1;
            },
            function (knockout_custom_attribute_2_1) {
                exportStar_1(knockout_custom_attribute_2_1);
                knockout_custom_attribute_1 = knockout_custom_attribute_2_1;
            },
            function (require_polyfill_2_1) {
                exportStar_1(require_polyfill_2_1);
                require_polyfill_1 = require_polyfill_2_1;
            }
        ],
        execute: function () {
        }
    };
});
