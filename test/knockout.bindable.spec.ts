/// <reference path="types.d.ts" />

import {KnockoutBindable} from '../src/knockout-bindable';
import {BehaviorPropertyObserver} from 'aurelia-templating';
import {SetterObserver} from 'aurelia-binding';
import * as ko from "knockout";

describe('knockout bindable', () => {
  let knockoutBindable: any;
  let observer: any;

  function mockBindable(target?: any) {
    observer = new BehaviorPropertyObserver(<any>null, <any>null, <any>null, <any>null, <any>null);

    if (target) {
      observer.setValue = function (value: any) {
        target.price = value;
      };
    } else {
      observer.setValue = jasmine.createSpy("setValue spy");
    }

    knockoutBindable = new KnockoutBindable(<any>null);
    knockoutBindable.getObserver = jasmine.createSpy("getObserver spy").and.returnValue(observer);
  }

  function mockNotBindable() {
    observer = new SetterObserver();
    observer.setValue = jasmine.createSpy("setValue spy");

    knockoutBindable = new KnockoutBindable(<any>null);
    knockoutBindable.getObserver = jasmine.createSpy("getObserver spy").and.returnValue(observer);
  }


  it('empty activationData - nothing happens', () => {
    mockBindable();

    knockoutBindable.applyBindableValues({}, null);

    expect(knockoutBindable.getObserver).not.toHaveBeenCalled();
    expect(observer.setValue).not.toHaveBeenCalled();
  });

  it('activationData with no Observable - nothing happens', () => {
    mockBindable();
    let target = { price: null };

    knockoutBindable.applyBindableValues({ price: 5 }, target);

    expect(knockoutBindable.getObserver).not.toHaveBeenCalled();
    expect(observer.setValue).not.toHaveBeenCalled();
  });

  it('activationData with no Observable; apply non observables - value is updated', () => {
    let target = { price: null };
    mockBindable(target);

    knockoutBindable.applyBindableValues({ price: 5 }, target, false);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(target.price).toBe(5);
  });

  it('activationData with Observable - value is updated', () => {
    let target = { price: null };
    mockBindable(target);

    knockoutBindable.applyBindableValues({ price: ko.observable(5) }, target);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(target.price).toBe(5);
  });

  it('activationData with Observable; no bindable property - nothing happens', () => {
    mockNotBindable();
    let target = { price: null };

    knockoutBindable.applyBindableValues({ price: ko.observable(5) }, target);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(observer.setValue).not.toHaveBeenCalledWith(5);
  });

  it('activationData with Observable - subscription updates value', () => {
    let activationData = { price: ko.observable(5) };
    let target = { price: null };
    mockBindable(target);

    knockoutBindable.applyBindableValues(activationData, target);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(knockoutBindable.subscriptions.length).toBe(1);
    expect(target.price).toBe(5);

    activationData.price(6);
    expect(target.price).toBe(6);
  });

  it('activationData with Observable - unbind disposes subscriptions', () => {
    let activationData = { price: ko.observable(5) };
    let unbindCounter = 0;
    let target = {
      price: null,
      unbind: function () {
        unbindCounter = unbindCounter + 1;
      }
    };
    mockBindable(target);

    knockoutBindable.applyBindableValues(activationData, target);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(knockoutBindable.subscriptions.length).toBe(1);

    target.unbind();

    expect(knockoutBindable.subscriptions.length).toBe(0);
    expect(unbindCounter).toBe(1);
  });
});
