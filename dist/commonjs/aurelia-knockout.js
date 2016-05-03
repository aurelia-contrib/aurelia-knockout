"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _class;

exports.configure = configure;

var _knockout = require("knockout");

var ko = _interopRequireWildcard(_knockout);

var _aureliaCompiler = require("gooy/aurelia-compiler");

var _aureliaDependencyInjection = require("aurelia-dependency-injection");

var _aureliaLoader = require("aurelia-loader");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KnockoutComposition = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaCompiler.Compiler, _aureliaDependencyInjection.Container, _aureliaLoader.Loader), _dec(_class = function () {
  function KnockoutComposition(compiler, container, loader) {
    _classCallCheck(this, KnockoutComposition);

    this.compiler = compiler;
    this.container = container;
    this.loader = loader;
  }

  KnockoutComposition.prototype.register = function register() {
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
  };

  KnockoutComposition.prototype.callEvent = function callEvent(element, eventName, args) {
    var viewModel = ko.dataFor(element.children[0]);

    var func = viewModel[eventName];

    if (func && typeof func === "function") {
      func.apply(viewModel, args);
    }
  };

  KnockoutComposition.prototype.doComposition = function doComposition(element, unwrappedValue, viewModel) {
    this.buildCompositionSettings(unwrappedValue, viewModel).then(function (settings) {
      this.compiler.composeElementInstruction(element, settings, this).then(function () {
        this.callEvent(element, "compositionComplete", [element, element.parentElement]);
      }.bind(this));
    }.bind(this));
  };

  KnockoutComposition.prototype.buildCompositionSettings = function buildCompositionSettings(value, bindingContext) {
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
    } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
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
  };

  KnockoutComposition.prototype.loadModule = function loadModule(moduleId) {
    return this.loader.loadModule(moduleId).then(function (result) {
      if (typeof result !== "function") {
        result = result[Object.keys(result)[0]];
      }

      return this.container.get(result);
    }.bind(this));
  };

  KnockoutComposition.prototype.endsWith = function endsWith(s, suffix) {
    return s.indexOf(suffix, s.length - suffix.length) !== -1;
  };

  return KnockoutComposition;
}()) || _class);
function configure(frameworkConfig) {
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

  frameworkConfig.container.get(KnockoutComposition).register();
}