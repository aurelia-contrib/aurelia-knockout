import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';


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


@customAttribute('knockout')
@inject(Element)
export class KnockoutCustomAttribute {

  constructor(element) {
    this.element = element;
  }

  static register() {
    ko.bindingHandlers.stopKoBinding = {
      init: function () {
        return { controlsDescendantBindings: true };
      }
    };

    ko.virtualElements.allowedBindings.stopKoBinding = true;
  }

  /** internal: do not use */
  bind(executionContext) {
    var data = getFirstBoundChild(this.element);
    if (data) {
      var startComment = document.createComment(" ko stopKoBinding: true ");
      var endComment = document.createComment(" /ko ");

      var parentNode = data.parentElement;
      parentNode.insertBefore(startComment, data);
      parentNode.appendChild(endComment);
    }

    ko.applyBindings(executionContext, this.element);
  }

  /** internal: do not use */
  unbind() {
    ko.cleanNode(this.element);
  }
}
