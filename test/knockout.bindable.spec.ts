import {KnockoutBindable} from '../src/knockout-bindable';
import {BehaviorPropertyObserver} from 'aurelia-templating';
import * as aureliaBinding from 'aurelia-binding';
import * as ko from "knockout";
import test from 'ava';
import * as sinon from 'sinon';

let knockoutBindable: any;
let observer: any; // BehaviorPropertyObserver or SetterObserver

const mockBindable = (target?: any) => {
  observer = new BehaviorPropertyObserver(<any>null, <any>null, <any>null, <any>null, <any>null);

  if (target) {
    observer.setValue = (value: any) => target.price = value;
  } else {
    observer.setValue = sinon.spy();
  }

  knockoutBindable = new KnockoutBindable(<any>null);
  knockoutBindable.getObserver = sinon.stub().returns(observer);
}

const mockNotBindable = () => {
  observer = new (<any>aureliaBinding).SetterObserver();
  observer.setValue = sinon.spy();

  knockoutBindable = new KnockoutBindable(<any>null);
  knockoutBindable.getObserver = sinon.stub().returns(observer);
}

test('empty activationData - nothing happens', t => {
  mockBindable();

  knockoutBindable.applyBindableValues({}, null);

  t.is(knockoutBindable.getObserver.called, false);
  t.is(observer.setValue.called, false);
});

test('activationData with no Observable - nothing happens', t => {
  mockBindable();
  const target = { price: null };

  knockoutBindable.applyBindableValues({ price: 5 }, target);

  t.is(knockoutBindable.getObserver.called, false);
  t.is(observer.setValue.called, false);
});

test('activationData with no Observable; apply non observables - value is updated', t => {
  const target = { price: null };
  mockBindable(target);

  knockoutBindable.applyBindableValues({ price: 5 }, target, false);

  t.is(knockoutBindable.getObserver.called, true);
  t.is(target.price, 5);
});

test('activationData with Observable - value is updated', t => {
  const target = { price: null };
  mockBindable(target);

  knockoutBindable.applyBindableValues({ price: ko.observable(5) }, target);

  t.is(knockoutBindable.getObserver.called, true);
  t.is(target.price, 5);
});

test('activationData with Observable; no bindable property - nothing happens', t => {
  mockNotBindable();
  const target = { price: null };

  knockoutBindable.applyBindableValues({ price: ko.observable(5) }, target);

  t.is(knockoutBindable.getObserver.called, true);
  t.is(observer.setValue.called, false);
});

test('activationData with Observable - subscription updates value', t => {
  const activationData = { price: ko.observable(5) };
  const target = { price: null };
  mockBindable(target);

  knockoutBindable.applyBindableValues(activationData, target);

  t.is(knockoutBindable.getObserver.called, true);
  t.is(knockoutBindable.subscriptions.length, 1);
  t.is(target.price, 5);

  activationData.price(6);
  t.is(target.price, 6);
});

test('activationData with Observable - unbind disposes subscriptions', t => {
  const activationData = { price: ko.observable(5) };
  let unbindCounter = 0;
  const target = {
    price: null,
    unbind: () => unbindCounter++
  };
  mockBindable(target);

  knockoutBindable.applyBindableValues(activationData, target);

  t.is(knockoutBindable.getObserver.called, true);
  t.is(knockoutBindable.subscriptions.length, 1);

  target.unbind();

  t.is(knockoutBindable.subscriptions.length, 0);
  t.is(unbindCounter, 1);
});
