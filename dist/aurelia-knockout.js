
import {inject} from "aurelia-dependency-injection";
import {customAttribute} from "aurelia-framework";

@customAttribute("knockout")
@inject(Element)
export class KnockoutCustomAttribute {

  constructor(element) {
    this.element = element;
  }

  bind(executionContext) {
    ko.applyBindings(executionContext, this.element);
  }

  unbdind() {
    ko.cleanNode(this.element);
  }
}
