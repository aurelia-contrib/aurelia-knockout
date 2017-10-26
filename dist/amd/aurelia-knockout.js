define(["require", "exports", "aurelia-pal", "./knockout-bindable", "./knockout-composition", "./knockout-custom-attribute", "./require-polyfill", "./knockout-custom-attribute", "./knockout-composition", "./require-polyfill"], function (require, exports, aurelia_pal_1, knockout_bindable_1, knockout_composition_1, knockout_custom_attribute_1, require_polyfill_1, knockout_custom_attribute_2, knockout_composition_2, require_polyfill_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(knockout_bindable_1);
    __export(knockout_composition_1);
    __export(knockout_custom_attribute_1);
    __export(require_polyfill_1);
    function configure(frameworkConfig) {
        // register custom attribute
        frameworkConfig.globalResources(aurelia_pal_1.PLATFORM.moduleName('./knockout-custom-attribute'));
        // register knockout custom binding for composition logic
        frameworkConfig.container.get(knockout_composition_2.KnockoutComposition).register();
        // register require function in window object if not available
        frameworkConfig.container.get(require_polyfill_2.RequirePolyfill).register();
        // register stopKoBindings custom binding
        knockout_custom_attribute_2.KnockoutCustomAttribute.register();
    }
    exports.configure = configure;
});
