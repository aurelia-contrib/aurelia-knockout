define(['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.KnockoutCustomAttribute = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var KnockoutCustomAttribute = exports.KnockoutCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('knockout'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
    function KnockoutCustomAttribute(element) {
      _classCallCheck(this, KnockoutCustomAttribute);

      this.element = element;
    }

    KnockoutCustomAttribute.prototype.bind = function bind(executionContext) {
      ko.applyBindings(executionContext, this.element);
    };

    KnockoutCustomAttribute.prototype.unbind = function unbind() {
      ko.cleanNode(this.element);
    };

    return KnockoutCustomAttribute;
  }()) || _class) || _class);
});