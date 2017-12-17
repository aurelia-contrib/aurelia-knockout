import * as ko from 'knockout';
import {Container, inject} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {ViewSlot, CompositionEngine} from 'aurelia-templating';


function endsWith(s: string, suffix: string): boolean {
  return s.indexOf(suffix, s.length - suffix.length) !== -1;
}

function getMatchingProperty(result: any, propName: string): string|null {
  let properties: string[] = Object.keys(result);
  for (let index: number = 0; index < properties.length; index++) {
    let prop: string = properties[index].toLowerCase();
    if (prop.indexOf(propName) !== -1) {
      return properties[index];
    }
  }

  return null;
}

function callEvent(element: Element, eventName: string, args: any): void {
  let viewModel: any = ko.dataFor(element.children[0]);

  let func: Function = viewModel[eventName];

  if (func && typeof func === 'function') {
    func.apply(viewModel, args);
  }
}

function doComposition(element: Element, unwrappedValue: any, viewModel: any): void {
  this.buildCompositionSettings(unwrappedValue, viewModel).then((settings: any): void => {
    composeElementInstruction.call(this, element, settings).then((): void => {
      callEvent(element, 'compositionComplete', [element, element.parentElement]);
    });
  });
}

function composeElementInstruction(element: Element, instruction: any): Promise<void> {
  instruction.viewSlot = instruction.viewSlot || new ViewSlot(element, true, this);
  return processInstruction.call(this, instruction);
}

function processInstruction(instruction: any): Promise<void> {
  instruction.container = instruction.container || this.container;
  instruction.executionContext = instruction.executionContext || this;
  instruction.viewSlot = instruction.viewSlot || this.viewSlot;
  instruction.viewResources = instruction.viewResources || this.viewResources;
  instruction.currentBehavior = instruction.currentBehavior || this.currentBehavior;

  return this.compositionEngine.compose(instruction).then((next: any): void => {
    this.currentBehavior = next;
    this.currentViewModel = next ? next.executionContext : null;
  });
}

function loadModule(moduleId: string, loader: Loader): Promise<any> {
  return loader.loadModule(moduleId);
}



@inject(CompositionEngine, Container, Loader)
export class KnockoutComposition {

  compositionEngine: CompositionEngine;
  container: Container;
  loader: Loader;

  constructor(compositionEngine: CompositionEngine, container: Container, loader: Loader) {
    this.compositionEngine = compositionEngine;
    this.container = container;
    this.loader = loader;
  }

  /**
   * Registers the `compose` Knockout Binding to use Compositions in your Views.
   */
  register(): void {
    // a bit hacky, I know ;)
    if (typeof window !== "undefined") {
      (<any>window).ko = ko;
    }

    (<any>ko.bindingHandlers).compose = {
      update: (element: Element, valueAccessor: any, allBindings: any, viewModel: any): void => {
        let value: any = valueAccessor();

        if (element.childElementCount > 0) {
          // Remove previous composed view
          callEvent(element, 'detached', [element, element.parentElement]);

          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        }

        doComposition.call(this, element, ko.unwrap(value), viewModel);
      }
    };

    ko.virtualElements.allowedBindings["compose"] = true;
  }

  /** internal: do not use */
  buildCompositionSettings(value: any, bindingContext: any): Promise<any> {
    let view: string|null = null;
    let moduleId: string|null = null;
    let viewModel: any|null = null;
    let activationData: any|null = null;

    // See http://durandaljs.com/documentation/Using-Composition.html

    if (typeof value === 'string') {
      if (endsWith(value, '.html')) {
        // The name of the html view (assuming that the model name is equivalent to the view)
        view = value;
        moduleId = value.substr(0, value.length - 5);
      } else {
        // The name of the module (moduleId)
        moduleId = value;
      }
    } else if (typeof value === 'object' && value) {
      if (value.view && !value.model) {
        // Only view is set. Bind it to the current viewModel
        view = value.view;
        viewModel = bindingContext;
      } else if (!value.view && value.model) {
        // Only viewModel is set.
        viewModel = value.model;
      } else if (value.view && value.model) {
        // Both model and view are set
        view = value.view;
        viewModel = value.model;
      } else {
        // The value is a viewModel instance
        viewModel = value;
      }

      if (value.activationData) {
        activationData = value.activationData;
      }

      if (typeof viewModel === 'string') {
        // The model is a moduleId
        moduleId = viewModel;
        viewModel = null;
      }
    } else if (typeof value === 'function') {
      // Call the constructor
      viewModel = value();
    }

    let settings = { view: view, viewModel: viewModel, model: activationData };

    if (!viewModel && moduleId) {
      return this.getViewModelInstance(moduleId).then((modelInstance: any): Promise<any> => {
        settings.viewModel = modelInstance;
        return Promise.resolve(settings);
      });
    }

    return Promise.resolve(settings);
  }

  /** internal: do not use */
  getViewModelInstance(moduleId: string): Promise<any> {
    let index: number = moduleId.lastIndexOf("/");
    let fileName: string = moduleId.substr(index === -1 ? 0 : index + 1).toLowerCase();

    return loadModule(moduleId, this.loader).then((result: any): any => {
      if (typeof result !== 'function') {
        // Try to find a property which name matches the filename of the module
        let constructorPropName: string|null = getMatchingProperty(result, fileName);

        if (constructorPropName) {
          // Use function of property.
          // This occurs if the constructor function is exported by the module.
          result = result[constructorPropName];
        } else {
          // The module returns an instance.
          return result;
        }
      }

      this.container.registerTransient(result);
      return this.container.get(result);
    });
  }
}
