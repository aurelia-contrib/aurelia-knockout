import {KnockoutBindable} from '../src/knockout-bindable';
import {BehaviorPropertyObserver} from 'aurelia-templating';
import {SetterObserver} from 'aurelia-binding';

describe('knockout composition', function() {
  var knockoutBindable;
  var observer;

  function mockBindable(target) {
    observer = new BehaviorPropertyObserver(null, null, null, null, null);

    if (target) {
      observer.setValue = function (value) {
        target.price = value;
      };
    } else {
      observer.setValue = jasmine.createSpy("setValue func");
    }

    knockoutBindable = new KnockoutBindable(null);
    knockoutBindable.getObserver = jasmine.createSpy("getObserver func").and.returnValue(observer);
  }

  function mockNotBindable() {
    observer = new SetterObserver();
    observer.setValue = jasmine.createSpy("setValue func");

    knockoutBindable = new KnockoutBindable(null);
    knockoutBindable.getObserver = jasmine.createSpy("getObserver func").and.returnValue(observer);
  }


  it('empty activationData - nothing happens', () => {
    mockBindable();

    knockoutBindable.applyBindableValues({}, null);

    expect(knockoutBindable.getObserver).not.toHaveBeenCalled();
    expect(observer.setValue).not.toHaveBeenCalled();
  });

  it('activationData with no Observable - nothing happens', () => {
    mockBindable();
    var target = { price: null };

    knockoutBindable.applyBindableValues({ price: 5 }, target);

    expect(knockoutBindable.getObserver).not.toHaveBeenCalled();
    expect(observer.setValue).not.toHaveBeenCalled();
  });

  it('activationData with no Observable; apply non observables - value is updated', () => {
    var target = { price: null };
    mockBindable(target);

    knockoutBindable.applyBindableValues({ price: 5 }, target, false);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(target.price).toBe(5);
  });

  it('activationData with Observable - value is updated', () => {
    var target = { price: null };
    mockBindable(target);

    knockoutBindable.applyBindableValues({ price: ko.observable(5) }, target);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(target.price).toBe(5);
  });

  it('activationData with Observable; no bindable property - nothing happens', () => {
    mockNotBindable();
    var target = { price: null };

    knockoutBindable.applyBindableValues({ price: ko.observable(5) }, target);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(observer.setValue).not.toHaveBeenCalledWith(5);
  });

  it('activationData with Observable - subscription updates value', () => {
    var activationData = { price: ko.observable(5) };
    var target = { price: null };
    mockBindable(target);

    knockoutBindable.applyBindableValues(activationData, target);

    expect(knockoutBindable.getObserver).toHaveBeenCalled();
    expect(knockoutBindable.subscriptions.length).toBe(1);
    expect(target.price).toBe(5);

    activationData.price(6);
    expect(target.price).toBe(6);
  });

  it('activationData with Observable - unbind disposes subscriptions', () => {
    var activationData = { price: ko.observable(5) };
    var unbindCounter = 0;
    var target = {
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
