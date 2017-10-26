var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-loader", "aurelia-dependency-injection"], function (require, exports, aurelia_loader_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RequirePolyfill = (function () {
        function RequirePolyfill(loader) {
            this.loader = loader;
        }
        /**
         * Registers the `require` function if not set.
         */
        RequirePolyfill.prototype.register = function () {
            var _this = this;
            var w = window;
            if (!w.require) {
                w.require = function (modulesToLoad, callback) {
                    var promises = [];
                    modulesToLoad.forEach(function (module) {
                        if (module.startsWith("text!")) {
                            promises.push(_this.loader.loadText(module.substr(5)));
                        }
                        else {
                            promises.push(_this.loader.loadModule(module));
                        }
                    });
                    Promise.all(promises).then(function (r) {
                        var results = [];
                        r.forEach(function (element) {
                            var props = Object.keys(element);
                            if (props.length === 1 && typeof element[props[0]] === "function") {
                                results.push(element[props[0]]);
                            }
                            else {
                                results.push(element);
                            }
                        });
                        callback.apply(_this, results);
                    });
                };
            }
        };
        return RequirePolyfill;
    }());
    RequirePolyfill = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_loader_1.Loader)
    ], RequirePolyfill);
    exports.RequirePolyfill = RequirePolyfill;
});
