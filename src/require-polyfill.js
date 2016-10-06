import {Loader} from 'aurelia-loader';
import {inject} from 'aurelia-dependency-injection';

@inject(Loader)
export class RequirePolyfill {

  constructor(loader: Loader) {
    this.loader = loader;
  }

  /**
   * Registers the `require` function if not set.
   */
  register() {
    if (!window.require) {
      window.require = (modulesToLoad, callback) => {
        var promises = [];
        modulesToLoad.forEach((module) => {
          if (module.startsWith("text!")) {
            promises.push(this.loader.loadText(module.substr(5)));
          } else {
            promises.push(this.loader.loadModule(module));
          }
        });

        Promise.all(promises).then((r) => {
          var results = [];
          r.forEach((element) => {
            var props = Object.keys(element);
            if (props.length === 1 && typeof element[props[0]] === "function") {
              results.push(element[props[0]]);
            } else {
              results.push(element);
            }
          });

          callback.apply(this, results);
        });
      };
    }
  }
}
