'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export, _context) {
  "use strict";

  var inject, customAttribute, _dec, _dec2, _class, KnockoutCustomAttribute;

  

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

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }],
    execute: function () {
      _export('KnockoutCustomAttribute', KnockoutCustomAttribute = (_dec = customAttribute('knockout'), _dec2 = inject(Element), _dec(_class = _dec2(_class = function () {
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
      }()) || _class) || _class));

      _export('KnockoutCustomAttribute', KnockoutCustomAttribute);
    }
  };
});