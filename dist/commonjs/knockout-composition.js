"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ko = require("knockout");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_loader_1 = require("aurelia-loader");
var aurelia_templating_1 = require("aurelia-templating");
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
function getAuTarget(elements) {
    var _a;
    for (var i = 0; i < elements.length; i++) {
        if ((_a = elements.item(i)) === null || _a === void 0 ? void 0 : _a.classList.contains("au-target")) {
            return elements.item(i);
        }
    }
    return null;
}
function callEvent(element, eventName, args) {
    var target = getAuTarget(element.children);
    if (target) {
        var viewModel = ko.dataFor(target);
        var func = viewModel[eventName];
        if (func && typeof func === 'function') {
            func.apply(viewModel, args);
        }
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
    instruction.viewSlot = instruction.viewSlot || new aurelia_templating_1.ViewSlot(element, true, this);
    return processInstruction.call(this, instruction);
}
function processInstruction(instruction) {
    var _this = this;
    instruction.container = instruction.container || this.container;
    instruction.executionContext = instruction.executionContext || this;
    instruction.viewSlot = instruction.viewSlot || this.viewSlot;
    instruction.viewResources = instruction.viewResources || this.viewResources;
    instruction.currentBehavior = instruction.currentBehavior || this.currentBehavior;
    return this.compositionEngine.compose(instruction).then(function (next) {
        _this.currentBehavior = next;
        _this.currentViewModel = next ? next.executionContext : null;
    });
}
function loadModule(moduleId, loader) {
    return loader.loadModule(moduleId);
}
var KnockoutComposition = /** @class */ (function () {
    function KnockoutComposition(compositionEngine, container, loader) {
        this.compositionEngine = compositionEngine;
        this.container = container;
        this.loader = loader;
    }
    /**
     * Registers the `compose` Knockout Binding to use Compositions in your Views.
     */
    KnockoutComposition.prototype.register = function () {
        var _this = this;
        // a bit hacky, I know ;)
        if (typeof window !== "undefined") {
            window.ko = ko;
        }
        ko.bindingHandlers.compose = {
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor();
                if (element.childElementCount > 0) {
                    // Remove previous composed view
                    callEvent(element, 'detached', [element, element.parentElement]);
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                }
                if (viewModel) {
                    viewModel.$parent = viewModel.$parent || bindingContext.$parent;
                    viewModel.$root = viewModel.$root || bindingContext.$root;
                }
                doComposition.call(_this, element, ko.unwrap(value), viewModel);
            }
        };
        ko.virtualElements.allowedBindings["compose"] = true;
    };
    /** internal: do not use */
    KnockoutComposition.prototype.buildCompositionSettings = function (value, bindingContext) {
        var view = null;
        var moduleId = null;
        var viewModel = null;
        var activationData = null;
        // See http://durandaljs.com/documentation/Using-Composition.html
        if (typeof value === 'string') {
            if (endsWith(value, '.html')) {
                // The name of the html view (assuming that the model name is equivalent to the view)
                view = value;
                moduleId = value.substr(0, value.length - 5);
            }
            else {
                // The name of the module (moduleId)
                moduleId = value;
            }
        }
        else if (typeof value === 'object' && value) {
            if (value.view && !value.model) {
                // Only view is set. Bind it to the current viewModel
                view = value.view;
                viewModel = bindingContext;
            }
            else if (!value.view && value.model) {
                // Only viewModel is set.
                viewModel = value.model;
            }
            else if (value.view && value.model) {
                // Both model and view are set
                view = value.view;
                viewModel = value.model;
            }
            else {
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
        }
        else if (typeof value === 'function') {
            // Call the constructor
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
    /** internal: do not use */
    KnockoutComposition.prototype.getViewModelInstance = function (moduleId) {
        var _this = this;
        var index = moduleId.lastIndexOf("/");
        var fileName = moduleId.substr(index === -1 ? 0 : index + 1).toLowerCase();
        return loadModule(moduleId, this.loader).then(function (result) {
            if (typeof result !== 'function') {
                // Try to find a property which name matches the filename of the module
                var constructorPropName = getMatchingProperty(result, fileName);
                if (constructorPropName) {
                    // Use function of property.
                    // This occurs if the constructor function is exported by the module.
                    result = result[constructorPropName];
                }
                else {
                    // The module returns an instance.
                    return result;
                }
            }
            _this.container.registerTransient(result);
            return _this.container.get(result);
        });
    };
    KnockoutComposition = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_templating_1.CompositionEngine, aurelia_dependency_injection_1.Container, aurelia_loader_1.Loader)
    ], KnockoutComposition);
    return KnockoutComposition;
}());
exports.KnockoutComposition = KnockoutComposition;
