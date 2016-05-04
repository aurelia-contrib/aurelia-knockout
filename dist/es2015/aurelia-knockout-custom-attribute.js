var _dec, _dec2, _class;

import { inject } from "aurelia-dependency-injection";
import { customAttribute } from "aurelia-templating";

export let KnockoutCustomAttribute = (_dec = customAttribute("knockout"), _dec2 = inject(Element), _dec(_class = _dec2(_class = class KnockoutCustomAttribute {

  constructor(element) {
    this.element = element;
  }

  bind(executionContext) {
    ko.applyBindings(executionContext, this.element);
  }

  unbdind() {
    ko.cleanNode(this.element);
  }
}) || _class) || _class);