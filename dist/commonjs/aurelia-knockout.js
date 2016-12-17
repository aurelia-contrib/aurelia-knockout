"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./knockout-bindable"));
__export(require("./knockout-composition"));
__export(require("./knockout-custom-attribute"));
__export(require("./require-polyfill"));
const knockout_custom_attribute_1 = require("./knockout-custom-attribute");
const knockout_composition_1 = require("./knockout-composition");
const require_polyfill_1 = require("./require-polyfill");
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
exports.configure = configure;
