var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _class;



import * as ko from 'knockout';
import { Container, inject } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { ViewSlot, CompositionEngine } from 'aurelia-templating';

function endsWith(s, suffix) {
  return s.indexOf(suffix, s.length - suffix.length) !== -1;
}

function getMatchingProperty(result, propName) {
  var properties = Object.keys(result);
  for (var index = 0; index < properties.length; index++) {
    var prop = properties[index].toLowerCase();
    if (prop.indexOf(propName) !== -1) {
      return properties[index];
    }
  }

  return null;
}

function callEvent(element, eventName, args) {
  var viewModel = ko.dataFor(element.children[0]);

  var func = viewModel[eventName];

  if (func && typeof func === 'function') {
    func.apply(viewModel, args);
  }
}

function doComposition(element, unwrappedValue, viewModel) {
  var _this = this;

  this.buildCompositionSettings(unwrappedValue, viewModel).then(function (settings) {
    composeElementInstruction.call(_this, element, settings).then(function () {
      callEvent(element, 'compositionComplete', [element, element.parentElement]);
    });
  });
}

function composeElementInstruction(element, instruction) {
  instruction.viewSlot = instruction.viewSlot || new ViewSlot(element, true, this);
  return processInstruction.call(this, instruction);
}

function processInstruction(instruction) {
  var _this2 = this;

  instruction.container = instruction.container || this.container;
  instruction.executionContext = instruction.executionContext || this;
  instruction.viewSlot = instruction.viewSlot || this.viewSlot;
  instruction.viewResources = instruction.viewResources || this.viewResources;
  instruction.currentBehavior = instruction.currentBehavior || this.currentBehavior;

  return this.compositionEngine.compose(instruction).then(function (next) {
    _this2.currentBehavior = next;
    _this2.currentViewModel = next ? next.executionContext : null;
  });
}

function loadModule(moduleId, loader) {
  return loader.loadModule(moduleId);
}

export var KnockoutComposition = (_dec = inject(CompositionEngine, Container, Loader), _dec(_class = function () {
  function KnockoutComposition(compositionEngine, container, loader) {
    

    this.compositionEngine = compositionEngine;
    this.container = container;
    this.loader = loader;
  }

  KnockoutComposition.prototype.register = function register() {
    var _this3 = this;

    window.ko = ko;

    ko.bindingHandlers.compose = {
      update: function update(element, valueAccessor, allBindings, viewModel) {
        var value = valueAccessor();

        if (element.childElementCount > 0) {
          callEvent(element, 'detached', [element, element.parentElement]);

          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        }

        doComposition.call(_this3, element, ko.unwrap(value), viewModel);
      }
    };

    ko.virtualElements.allowedBindings["compose"] = true;
  };

  KnockoutComposition.prototype.buildCompositionSettings = function buildCompositionSettings(value, bindingContext) {
    var view = void 0;
    var moduleId = void 0;
    var viewModel = void 0;
    var activationData = void 0;

    if (typeof value === 'string') {
      if (endsWith(value, '.html')) {
        view = value;
        moduleId = value.substr(0, value.length - 5);
      } else {
        moduleId = value;
      }
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value) {
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

    var settings = { view: view, viewModel: viewModel, model: activationData };

    if (!viewModel && moduleId) {
      return this.getViewModelInstance(moduleId).then(function (modelInstance) {
        settings.viewModel = modelInstance;
        return Promise.resolve(settings);
      });
    }

    return Promise.resolve(settings);
  };

  KnockoutComposition.prototype.getViewModelInstance = function getViewModelInstance(moduleId) {
    var _this4 = this;

    var index = moduleId.lastIndexOf("/");
    var fileName = moduleId.substr(index === -1 ? 0 : index + 1).toLowerCase();

    return loadModule(moduleId, this.loader).then(function (result) {
      if (typeof result !== 'function') {
        var constructorPropName = getMatchingProperty(result, fileName);

        if (constructorPropName) {
          result = result[constructorPropName];
        } else {
          return result;
        }
      }

      return _this4.container.get(result);
    });
  };

  return KnockoutComposition;
}()) || _class);