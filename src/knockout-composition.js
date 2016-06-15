import * as ko from 'knockout';
import {Container, inject} from 'aurelia-dependency-injection';
import {Loader} from 'aurelia-loader';
import {ViewSlot, CompositionEngine} from 'aurelia-templating';

@inject(CompositionEngine, Container, Loader)
export class KnockoutComposition {

  constructor(compositionEngine, container, loader) {
    this.compositionEngine = compositionEngine;
    this.container = container;
    this.loader = loader;
  }

  register() {
    window.ko = ko;

    ko.bindingHandlers.compose = {
      update: (element, valueAccessor, allBindings, viewModel) => {
        let value = valueAccessor();

        if (element.childElementCount > 0) {
          // Remove previous composed view
          this.callEvent(element, 'detached', [element, element.parentElement]);

          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        }

        this.doComposition(element, ko.unwrap(value), viewModel);
      }
    };
  }

  callEvent(element, eventName, args) {
    let viewModel = ko.dataFor(element.children[0]);

    let func = viewModel[eventName];

    if (func && typeof func === 'function') {
      func.apply(viewModel, args);
    }
  }

  doComposition(element, unwrappedValue, viewModel) {
    this.buildCompositionSettings(unwrappedValue, viewModel).then((settings) => {
      this.composeElementInstruction(element, settings, this).then(() => {
        this.callEvent(element, 'compositionComplete', [element, element.parentElement]);
      });
    });
  }

  composeElementInstruction(element, instruction, ctx) {
    instruction.viewSlot = instruction.viewSlot || new ViewSlot(element, true, ctx);
    return this.processInstruction(ctx, instruction);
  }

  processInstruction(ctx, instruction) {
    instruction.container = instruction.container || ctx.container;
    instruction.executionContext = instruction.executionContext || ctx;
    instruction.viewSlot = instruction.viewSlot || ctx.viewSlot;
    instruction.viewResources = instruction.viewResources || ctx.viewResources;
    instruction.currentBehavior = instruction.currentBehavior || ctx.currentBehavior;

    return this.compositionEngine.compose(instruction).then((next) => {
      ctx.currentBehavior = next;
      ctx.currentViewModel = next ? next.executionContext : null;
    });
  }

  buildCompositionSettings(value, bindingContext) {
    let view;
    let moduleId;
    let viewModel;
    let activationData;

    // See http://durandaljs.com/documentation/Using-Composition.html

    if (typeof value === 'string') {
      if (this.endsWith(value, '.html')) {
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
      return this.loadModule(moduleId).then((modelInstance) => {
        settings.viewModel = modelInstance;
        return Promise.resolve(settings);
      });
    }

    return Promise.resolve(settings);
  }

  loadModule(moduleId) {
    return this.loader.loadModule(moduleId).then((result) => {
      if (typeof result !== 'function') {
        //result = result[Object.keys(result)[0]];
        return result;
      }

      return this.container.get(result);
    });
  }

  endsWith(s, suffix) {
    return s.indexOf(suffix, s.length - suffix.length) !== -1;
  }
}
