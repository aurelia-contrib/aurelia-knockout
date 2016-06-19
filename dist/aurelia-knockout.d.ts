import * as ko from 'knockout';
import {
  Container,
  inject
} from 'aurelia-dependency-injection';
import {
  Loader
} from 'aurelia-loader';
import {
  ViewSlot,
  CompositionEngine,
  BehaviorPropertyObserver,
  customAttribute
} from 'aurelia-templating';
import {
  ObserverLocator
} from 'aurelia-binding';
export declare class KnockoutComposition {
  constructor(compositionEngine?: any, container?: any, loader?: any);
  register(): any;
  callEvent(element?: any, eventName?: any, args?: any): any;
  doComposition(element?: any, unwrappedValue?: any, viewModel?: any): any;
  composeElementInstruction(element?: any, instruction?: any, ctx?: any): any;
  processInstruction(ctx?: any, instruction?: any): any;
  buildCompositionSettings(value?: any, bindingContext?: any): any;
  loadModule(moduleId?: any): any;
  getViewModelInstance(moduleId?: any): any;
}
export declare class KnockoutBindable {
  observerLocator: any;
  subscriptions: any;
  constructor(observerLocator?: any);
  applyBindableValues(data?: any, target?: any, applyOnlyObservables?: any): any;
  getObserver(target?: any, key?: any): any;
}
export declare class KnockoutCustomAttribute {
  constructor(element?: any);
  bind(executionContext?: any): any;
  unbind(): any;
}