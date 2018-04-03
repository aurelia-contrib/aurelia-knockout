var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Loader } from 'aurelia-loader';
import { inject } from 'aurelia-dependency-injection';
let RequirePolyfill = class RequirePolyfill {
    constructor(loader) {
        this.loader = loader;
    }
    /**
     * Registers the `require` function if not set.
     */
    register() {
        const w = window;
        if (!w.require) {
            w.require = (modulesToLoad, callback) => {
                const promises = [];
                modulesToLoad.forEach((module) => {
                    if (module.startsWith("text!")) {
                        promises.push(this.loader.loadText(module.substr(5)));
                    }
                    else {
                        promises.push(this.loader.loadModule(module));
                    }
                });
                Promise.all(promises).then((r) => {
                    const results = [];
                    r.forEach((element) => {
                        const props = Object.keys(element);
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
    inject(Loader)
], RequirePolyfill);
export { RequirePolyfill };
