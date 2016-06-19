import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';

@customAttribute('knockout')
@inject(Element)
export class KnockoutCustomAttribute {

  constructor(element) {
    this.element = element;
  }

  /** internal: do not use */
  bind(executionContext) {
    ko.applyBindings(executionContext, this.element);
  }

  /** internal: do not use */
  unbind() {
    ko.cleanNode(this.element);
  }
}
