import {InternalPropertyObserver, ObserverLocator} from 'aurelia-binding';
import {BehaviorPropertyObserver} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import * as ko from 'knockout';

@inject(ObserverLocator)
export class KnockoutBindable {

  observerLocator: ObserverLocator;
  subscriptions: any[] = []; // Knockout subscriptions

  constructor(observerLocator: ObserverLocator) {
    this.observerLocator = observerLocator;
  }

  /**
   * Applys all values from a data object (usually the activation data) to the corresponding instance fields
   * in the current view model if they are marked as @bindable. By default all matching values from the data object
   * are applied. To only apply observable values set the last parameter to `true`. Subscriptions are created
   * for all Knockout observables in the data object to update the view-model values respectively.
   *
   * @param data - the data object
   * @param target - the target view model
   * @param applyOnlyObservables - `true` if only observable values should be applied, false by default.
   */
  applyBindableValues(data: any, target: any, applyOnlyObservables: boolean): void {
    data = data || {};
    target = target || {};
    applyOnlyObservables = applyOnlyObservables === undefined ? true : applyOnlyObservables;

    Object.keys(data).forEach((key: string) => {
      const outerValue: any = data[key];
      const isObservable: boolean = ko.isObservable(outerValue);

      if (isObservable || !applyOnlyObservables) {
        const observer: InternalPropertyObserver = this.getObserver(target, key);

        if (observer && observer instanceof BehaviorPropertyObserver) { // check if inner property is @bindable
          observer.setValue(isObservable ? ko.unwrap(outerValue) : outerValue);
        }

        if (isObservable) {
          this.subscriptions.push(outerValue.subscribe((newValue: any): void => {
            observer.setValue(newValue);
          }));
        }
      }
    });


    const originalUnbind: Function = target.unbind;

    target.unbind = (): void => {
      this.subscriptions.forEach((subscription: any): void => subscription.dispose());
      this.subscriptions = [];

      if (originalUnbind) {
        originalUnbind.call(target);
      }
    };
  }

  /** internal: do not use */
  getObserver(target: any, key: string): InternalPropertyObserver {
    return this.observerLocator.getObserver(target, key);
  }
}
