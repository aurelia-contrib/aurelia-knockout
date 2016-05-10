define(['exports', 'knockout', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-templating'], function (exports, _knockout, _aureliaDependencyInjection, _aureliaLoader, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.KnockoutComposition = undefined;

  var ko = _interopRequireWildcard(_knockout);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var KnockoutComposition = exports.KnockoutComposition = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.CompositionEngine, _aureliaDependencyInjection.Container, _aureliaLoader.Loader), _dec(_class = function () {
    function KnockoutComposition(compositionEngine, container, loader) {
      _classCallCheck(this, KnockoutComposition);

      this.compositionEngine = compositionEngine;
      this.container = container;
      this.loader = loader;
    }

    KnockoutComposition.prototype.register = function register() {
      var _this = this;

      window.ko = ko;

      ko.bindingHandlers.compose = {
        update: function update(element, valueAccessor, allBindings, viewModel) {
          var value = valueAccessor();

          if (element.childElementCount > 0) {
            _this.callEvent(element, 'detached', [element, element.parentElement]);

            while (element.firstChild) {
              element.removeChild(element.firstChild);
            }
          }

          _this.doComposition(element, ko.unwrap(value), viewModel);
        }
      };
    };

    KnockoutComposition.prototype.callEvent = function callEvent(element, eventName, args) {
      var viewModel = ko.dataFor(element.children[0]);

      var func = viewModel[eventName];

      if (func && typeof func === 'function') {
        func.apply(viewModel, args);
      }
    };

    KnockoutComposition.prototype.doComposition = function doComposition(element, unwrappedValue, viewModel) {
      var _this2 = this;

      this.buildCompositionSettings(unwrappedValue, viewModel).then(function (settings) {
        _this2.composeElementInstruction(element, settings, _this2).then(function () {
          _this2.callEvent(element, 'compositionComplete', [element, element.parentElement]);
        });
      });
    };

    KnockoutComposition.prototype.composeElementInstruction = function composeElementInstruction(element, instruction, ctx) {
      instruction.viewSlot = instruction.viewSlot || new _aureliaTemplating.ViewSlot(element, true, ctx);
      return this.processInstruction(ctx, instruction);
    };

    KnockoutComposition.prototype.processInstruction = function processInstruction(ctx, instruction) {
      instruction.container = instruction.container || ctx.container;
      instruction.executionContext = instruction.executionContext || ctx;
      instruction.viewSlot = instruction.viewSlot || ctx.viewSlot;
      instruction.viewResources = instruction.viewResources || ctx.viewResources;
      instruction.currentBehavior = instruction.currentBehavior || ctx.currentBehavior;

      return this.compositionEngine.compose(instruction).then(function (next) {
        ctx.currentBehavior = next;
        ctx.currentViewModel = next ? next.executionContext : null;
      });
    };

    KnockoutComposition.prototype.buildCompositionSettings = function buildCompositionSettings(value, bindingContext) {
      var view = void 0;
      var moduleId = void 0;
      var viewModel = void 0;
      var activationData = void 0;

      if (typeof value === 'string') {
        if (this.endsWith(value, '.html')) {
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
        return this.loadModule(moduleId).then(function (modelInstance) {
          settings.viewModel = modelInstance;
          return Promise.resolve(settings);
        });
      }

      return Promise.resolve(settings);
    };

    KnockoutComposition.prototype.loadModule = function loadModule(moduleId) {
      var _this3 = this;

      return this.loader.loadModule(moduleId).then(function (result) {
        if (typeof result !== 'function') {
          result = result[Object.keys(result)[0]];
        }

        return _this3.container.get(result);
      });
    };

    KnockoutComposition.prototype.endsWith = function endsWith(s, suffix) {
      return s.indexOf(suffix, s.length - suffix.length) !== -1;
    };

    return KnockoutComposition;
  }()) || _class);
});