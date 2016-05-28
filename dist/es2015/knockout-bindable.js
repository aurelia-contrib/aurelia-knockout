var _dec, _class;

import { ObserverLocator } from 'aurelia-binding';
import { BehaviorPropertyObserver } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';

export let KnockoutBindable = (_dec = inject(ObserverLocator), _dec(_class = class KnockoutBindable {

  constructor(observerLocator) {
    this.subscriptions = [];

    this.observerLocator = observerLocator;
  }

  applyBindableValues(data, target, applyOnlyObservables) {
    data = data || {};
    target = target || {};
    applyOnlyObservables = applyOnlyObservables === undefined ? true : applyOnlyObservables;

    let keys = Object.keys(data);

    keys.forEach(key => {
      let outerValue = data[key];
      let isObservable = ko.isObservable(outerValue);

      if (isObservable || !applyOnlyObservables) {
        let observer = this.getObserver(target, key);

        if (observer && observer instanceof BehaviorPropertyObserver) {
          observer.setValue(isObservable ? ko.unwrap(outerValue) : outerValue);
        }

        if (isObservable) {
          this.subscriptions.push(outerValue.subscribe(newValue => {
            observer.setValue(newValue);
          }));
        }
      }
    });

    let originalUnbind = target.unbind;

    target.unbind = () => {
      this.subscriptions.forEach(subscription => {
        subscription.dispose();
      });

      this.subscriptions = [];

      if (originalUnbind) {
        originalUnbind.call(target);
      }
    };
  }

  getObserver(target, key) {
    return this.observerLocator.getObserver(target, key);
  }
}) || _class);