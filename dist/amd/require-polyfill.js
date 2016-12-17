var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-loader", "aurelia-dependency-injection"], function (require, exports, aurelia_loader_1, aurelia_dependency_injection_1) {
    "use strict";
    let RequirePolyfill = class RequirePolyfill {
        constructor(loader) {
            this.loader = loader;
        }
        /**
         * Registers the `require` function if not set.
         */
        register() {
            var w = window;
            if (!w.require) {
                w.require = (modulesToLoad, callback) => {
                    var promises = [];
                    modulesToLoad.forEach((module) => {
                        if (module.startsWith("text!")) {
                            promises.push(this.loader.loadText(module.substr(5)));
                        }
                        else {
                            promises.push(this.loader.loadModule(module));
                        }
                    });
                    Promise.all(promises).then((r) => {
                        var results = [];
                        r.forEach((element) => {
                            var props = Object.keys(element);
                            if (props.length === 1 && typeof element[props[0]] === "function") {
                                results.push(element[props[0]]);
                            }
                            else {
                                results.push(element);
                            }
                        });
                        callback.apply(this, results);
                    });
                };
            }
        }
    };
    RequirePolyfill = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_loader_1.Loader)
    ], RequirePolyfill);
    exports.RequirePolyfill = RequirePolyfill;
});
