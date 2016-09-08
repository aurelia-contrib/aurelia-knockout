'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KnockoutCustomAttribute = exports.KnockoutBindable = exports.KnockoutComposition = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _class, _dec2, _class2, _dec3, _dec4, _class4;

var _knockout = require('knockout');

var ko = _interopRequireWildcard(_knockout);

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaLoader = require('aurelia-loader');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  instruction.viewSlot = instruction.viewSlot || new _aureliaTemplating.ViewSlot(element, true, this);
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

var KnockoutComposition = exports.KnockoutComposition = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.CompositionEngine, _aureliaDependencyInjection.Container, _aureliaLoader.Loader), _dec(_class = function () {
  function KnockoutComposition(compositionEngine, container, loader) {
    _classCallCheck(this, KnockoutComposition);

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
var KnockoutBindable = exports.KnockoutBindable = (_dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaBinding.ObserverLocator), _dec2(_class2 = function () {
  function KnockoutBindable(observerLocator) {
    _classCallCheck(this, KnockoutBindable);

    this.subscriptions = [];

    this.observerLocator = observerLocator;
  }

  KnockoutBindable.prototype.applyBindableValues = function applyBindableValues(data, target, applyOnlyObservables) {
    var _this5 = this;

    data = data || {};
    target = target || {};
    applyOnlyObservables = applyOnlyObservables === undefined ? true : applyOnlyObservables;

    var keys = Object.keys(data);

    keys.forEach(function (key) {
      var outerValue = data[key];
      var isObservable = ko.isObservable(outerValue);

      if (isObservable || !applyOnlyObservables) {
        (function () {
          var observer = _this5.getObserver(target, key);

          if (observer && observer instanceof _aureliaTemplating.BehaviorPropertyObserver) {
            observer.setValue(isObservable ? ko.unwrap(outerValue) : outerValue);
          }

          if (isObservable) {
            _this5.subscriptions.push(outerValue.subscribe(function (newValue) {
              observer.setValue(newValue);
            }));
          }
        })();
      }
    });

    var originalUnbind = target.unbind;

    target.unbind = function () {
      _this5.subscriptions.forEach(function (subscription) {
        subscription.dispose();
      });

      _this5.subscriptions = [];

      if (originalUnbind) {
        originalUnbind.call(target);
      }
    };
  };

  KnockoutBindable.prototype.getObserver = function getObserver(target, key) {
    return this.observerLocator.getObserver(target, key);
  };

  return KnockoutBindable;
}()) || _class2);


function getFirstBoundChild(rootNode) {
  var data = ko.dataFor(rootNode);
  if (data) {
    return rootNode;
  }

  for (var i = 0; i < rootNode.children.length; i++) {
    var child = rootNode.children[i];
    var childData = getFirstBoundChild(child);
    if (childData) {
      return childData;
    }
  }

  return null;
}

var KnockoutCustomAttribute = exports.KnockoutCustomAttribute = (_dec3 = (0, _aureliaTemplating.customAttribute)('knockout'), _dec4 = (0, _aureliaDependencyInjection.inject)(Element), _dec3(_class4 = _dec4(_class4 = function () {
  function KnockoutCustomAttribute(element) {
    _classCallCheck(this, KnockoutCustomAttribute);

    this.element = element;
  }

  KnockoutCustomAttribute.register = function register() {
    ko.bindingHandlers.stopKoBinding = {
      init: function init() {
        return { controlsDescendantBindings: true };
      }
    };

    ko.virtualElements.allowedBindings.stopKoBinding = true;
  };

  KnockoutCustomAttribute.prototype.bind = function bind(executionContext) {
    var data = getFirstBoundChild(this.element);
    if (data) {
      var startComment = document.createComment(" ko stopKoBinding: true ");
      var endComment = document.createComment(" /ko ");

      var parentNode = data.parentElement;
      parentNode.insertBefore(startComment, data);
      parentNode.appendChild(endComment);
    }

    ko.applyBindings(executionContext, this.element);
  };

  KnockoutCustomAttribute.prototype.unbind = function unbind() {
    ko.cleanNode(this.element);
  };

  return KnockoutCustomAttribute;
}()) || _class4) || _class4);