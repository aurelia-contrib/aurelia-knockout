import {Loader} from 'aurelia-loader';
import {inject} from 'aurelia-dependency-injection';

@inject(Loader)
export class RequirePolyfill {

  loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }

  /**
   * Registers the `require` function if not set.
   */
  register(): void {
    var w: any = <any>window;
    if (!w.require) {
      w.require = (modulesToLoad: string[], callback: Function) => {
        var promises: Promise<any>[] = [];
        modulesToLoad.forEach((module: string): void => {
          if (module.startsWith("text!")) {
            promises.push(this.loader.loadText(module.substr(5)));
          } else {
            promises.push(this.loader.loadModule(module));
          }
        });

        Promise.all(promises).then((r: any[]): void => {
          var results: any[] = [];
          r.forEach((element: any): void => {
            var props: string[] = Object.keys(element);
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
