'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export, _context) {
  "use strict";

  var inject, customAttribute, _dec, _dec2, _class, KnockoutCustomAttribute;

  

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

        KnockoutCustomAttribute.prototype.bind = function bind(executionContext) {
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