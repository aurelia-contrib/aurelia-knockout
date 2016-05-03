import * as ko from "knockout";
import {Compiler} from "gooy/aurelia-compiler";
import {inject} from "aurelia-dependency-injection";
import {customAttribute} from "aurelia-framework";

@customAttribute("knockout")
@inject(Element)
class KnockoutCustomAttribute {

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

export function configure(frameworkConfig) {
  // register custom attribute
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');
}
