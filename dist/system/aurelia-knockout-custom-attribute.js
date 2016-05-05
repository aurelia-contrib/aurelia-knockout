'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export, _context) {
  var inject, customAttribute, _dec, _dec2, _class, KnockoutCustomAttribute;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
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
          _classCallCheck(this, KnockoutCustomAttribute);

          this.element = element;
        }

        KnockoutCustomAttribute.prototype.bind = function bind(executionContext) {
          ko.applyBindings(executionContext, this.element);
        };

        KnockoutCustomAttribute.prototype.unbdind = function unbdind() {
          ko.cleanNode(this.element);
        };

        return KnockoutCustomAttribute;
      }()) || _class) || _class));

      _export('KnockoutCustomAttribute', KnockoutCustomAttribute);
    }
  };
});