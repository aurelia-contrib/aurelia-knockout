var _dec, _class;

import * as ko from "knockout";
import { Compiler } from "gooy/aurelia-compiler";
import { Container, inject } from "aurelia-dependency-injection";
import { Loader } from "aurelia-loader";

let KnockoutComposition = (_dec = inject(Compiler, Container, Loader), _dec(_class = class KnockoutComposition {

  constructor(compiler, container, loader) {
    this.compiler = compiler;
    this.container = container;
    this.loader = loader;
  }

  register() {
    window.ko = ko;

    ko.bindingHandlers.compose = {
      update: function (element, valueAccessor, allBindings, viewModel) {
        var value = valueAccessor();

        if (element.childElementCount > 0) {
          this.callEvent(element, "detached", [element, element.parentElement]);

          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        }

        this.doComposition(element, ko.unwrap(value), viewModel);
      }.bind(this)
    };
  }

  callEvent(element, eventName, args) {
    var viewModel = ko.dataFor(element.children[0]);

    var func = viewModel[eventName];

    if (func && typeof func === "function") {
      func.apply(viewModel, args);
    }
  }

  doComposition(element, unwrappedValue, viewModel) {
    this.buildCompositionSettings(unwrappedValue, viewModel).then(function (settings) {
      this.compiler.composeElementInstruction(element, settings, this).then(function () {
        this.callEvent(element, "compositionComplete", [element, element.parentElement]);
      }.bind(this));
    }.bind(this));
  }

  buildCompositionSettings(value, bindingContext) {
    var view;
    var moduleId;
    var viewModel;
    var activationData;

    if (typeof value === "string") {
      if (this.endsWith(value, ".html")) {
        view = value;
        moduleId = value.substr(0, value.length - 5);
      } else {
        moduleId = value;
      }
    } else if (typeof value === "object") {
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

      if (typeof viewModel === "string") {
        moduleId = viewModel;
        viewModel = null;
      }
    } else if (typeof value === "function") {
      viewModel = value();
    }

    var settings = { view: view, viewModel: viewModel, model: activationData };

    if (!viewModel) {
      return this.loadModule(moduleId).then(function (modelInstance) {
        settings.viewModel = modelInstance;
        return Promise.resolve(settings);
      });
    }

    return Promise.resolve(settings);
  }

  loadModule(moduleId) {
    return this.loader.loadModule(moduleId).then(function (result) {
      if (typeof result !== "function") {
        result = result[Object.keys(result)[0]];
      }

      return this.container.get(result);
    }.bind(this));
  }

  endsWith(s, suffix) {
    return s.indexOf(suffix, s.length - suffix.length) !== -1;
  }
}) || _class);


export function configure(frameworkConfig) {
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

  frameworkConfig.container.get(KnockoutComposition).register();
}