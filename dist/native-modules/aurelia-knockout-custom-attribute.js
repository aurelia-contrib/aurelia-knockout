var _dec, _dec2, _class;



import { inject } from 'aurelia-dependency-injection';
import { customAttribute } from 'aurelia-templating';

export var KnockoutCustomAttribute = (_dec = customAttribute('knockout'), _dec2 = inject(Element), _dec(_class = _dec2(_class = function () {
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
}()) || _class) || _class);