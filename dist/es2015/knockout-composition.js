var _dec, _class;

import * as ko from 'knockout';
import { Container, inject } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { ViewSlot, CompositionEngine } from 'aurelia-templating';

export let KnockoutComposition = (_dec = inject(CompositionEngine, Container, Loader), _dec(_class = class KnockoutComposition {

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
    this.buildCompositionSettings(unwrappedValue, viewModel).then(settings => {
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

    return this.compositionEngine.compose(instruction).then(next => {
      ctx.currentBehavior = next;
      ctx.currentViewModel = next ? next.executionContext : null;
    });
  }

  buildCompositionSettings(value, bindingContext) {
    let view;
    let moduleId;
    let viewModel;
    let activationData;

    if (typeof value === 'string') {
      if (this.endsWith(value, '.html')) {
        view = value;
        moduleId = value.substr(0, value.length - 5);
      } else {
        moduleId = value;
      }
    } else if (typeof value === 'object' && value) {
      if (value.view && !value.model) {
        view = value.view;
        viewModel = bindingContext;
      } else if (!value.view && value.model) {
        viewModel = value.model;
      } else if (value.view && value.model) {
        view = value.view;
        viewModel = value.model;
      } else {
        viewModel = value;
      }

      if (value.activationData) {
        activationData = value.activationData;
      }

      if (typeof viewModel === 'string') {
        moduleId = viewModel;
        viewModel = null;
      }
    } else if (typeof value === 'function') {
      viewModel = value();
    }

    let settings = { view: view, viewModel: viewModel, model: activationData };

    if (!viewModel && moduleId) {
      return this.loadModule(moduleId).then(modelInstance => {
        settings.viewModel = modelInstance;
        return Promise.resolve(settings);
      });
    }

    return Promise.resolve(settings);
  }

  loadModule(moduleId) {
    return this.loader.loadModule(moduleId).then(result => {
      if (typeof result !== 'function') {
        result = result[Object.keys(result)[0]];
      }

      return this.container.get(result);
    });
  }

  endsWith(s, suffix) {
    return s.indexOf(suffix, s.length - suffix.length) !== -1;
  }
}) || _class);