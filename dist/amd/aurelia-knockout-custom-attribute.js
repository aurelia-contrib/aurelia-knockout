define(['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.KnockoutCustomAttribute = undefined;

  

  var _dec, _dec2, _class;

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

  var KnockoutCustomAttribute = exports.KnockoutCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('knockout'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
    function KnockoutCustomAttribute(element) {
      

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
  }()) || _class) || _class);
});