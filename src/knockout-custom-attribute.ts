import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';
import * as ko from 'knockout';


function getFirstBoundChild(rootNode: Element): Element|null {
  const data: any = ko.dataFor(rootNode);
  if (data) {
    return rootNode;
  }

  for (let i: number = 0; i < rootNode.children.length; i++) {
    const child: Element = rootNode.children[i];
    const childData: Element|null = getFirstBoundChild(child);
    if (childData) {
      return childData;
    }
  }

  return null;
}


@customAttribute('knockout')
@inject(Element)
export class KnockoutCustomAttribute {

  element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  static register() {
    (<any>ko.bindingHandlers).stopKoBinding = {
      init: function (): any {
        return { controlsDescendantBindings: true };
      }
    };

    (<any>ko.virtualElements.allowedBindings).stopKoBinding = true;
  }

  /** internal: do not use */
  bind(executionContext: any): void {
    var data: Element|null = getFirstBoundChild(this.element);
    if (data) {
      var startComment: Comment = document.createComment(" ko stopKoBinding: true ");
      var endComment: Comment = document.createComment(" /ko ");

      var parentNode: Element|null = data.parentElement;

      if (parentNode) {
        parentNode.insertBefore(startComment, data);
        parentNode.appendChild(endComment);
      }
    }

    ko.applyBindings(executionContext, this.element);
  }

  /** internal: do not use */
  unbind(): void {
    ko.cleanNode(this.element);
  }
}
