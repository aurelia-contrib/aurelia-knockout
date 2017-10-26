"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_templating_1 = require("aurelia-templating");
var ko = require("knockout");
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
var KnockoutCustomAttribute = (function () {
    function KnockoutCustomAttribute(element) {
        this.element = element;
    }
    KnockoutCustomAttribute.register = function () {
        ko.bindingHandlers.stopKoBinding = {
            init: function () {
                return { controlsDescendantBindings: true };
            }
        };
        ko.virtualElements.allowedBindings.stopKoBinding = true;
    };
    /** internal: do not use */
    KnockoutCustomAttribute.prototype.bind = function (executionContext) {
        var data = getFirstBoundChild(this.element);
        if (data) {
            var startComment = document.createComment(" ko stopKoBinding: true ");
            var endComment = document.createComment(" /ko ");
            var parentNode = data.parentElement;
            if (parentNode) {
                parentNode.insertBefore(startComment, data);
                parentNode.appendChild(endComment);
            }
        }
        ko.applyBindings(executionContext, this.element);
    };
    /** internal: do not use */
    KnockoutCustomAttribute.prototype.unbind = function () {
        ko.cleanNode(this.element);
    };
    return KnockoutCustomAttribute;
}());
KnockoutCustomAttribute = __decorate([
    aurelia_templating_1.customAttribute('knockout'),
    aurelia_dependency_injection_1.inject(Element)
], KnockoutCustomAttribute);
exports.KnockoutCustomAttribute = KnockoutCustomAttribute;
