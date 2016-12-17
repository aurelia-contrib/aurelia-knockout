/// <reference path="types.d.ts" />

import {KnockoutComposition} from '../src/knockout-composition';
import * as ko from "knockout";

describe('knockout composition', function() {
  let knockoutComposition: any;
  let viewModelInstance: any;

  beforeEach(() => {
    viewModelInstance = Promise.resolve({ prop: "myInstance", test: () => {} });

    knockoutComposition = new KnockoutComposition(<any>null, <any>null, <any>null);
    knockoutComposition.getViewModelInstance = jasmine.createSpy("getViewModelInstance spy").and.returnValue(viewModelInstance);
  });

  it('registers knockout custom binding', () => {
    knockoutComposition.register();

    expect(ko.bindingHandlers["compose"]).toBeDefined();
  });

  it('build settings - null values', () => {
    let promise = knockoutComposition.buildCompositionSettings(null, null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: null, viewModel: null, model: null });
    });
  });

  it('build settings - html view', () => {
    let promise = knockoutComposition.buildCompositionSettings("test.html", null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: "test.html", viewModel: "test", model: null });
    });
  });

  it('build settings - moduleId', () => {
    let promise = knockoutComposition.buildCompositionSettings("test", null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: null, viewModel: viewModelInstance, model: null });
    });
  });

  it('build settings - view object', () => {
    let promise = knockoutComposition.buildCompositionSettings({ view: "test.html" }, { prop: "context" });

    promise.then((settings: any) => {
      expect(settings).toBe({ view: "test.html", viewModel: { prop: "context" }, model: null });
    });
  });

  it('build settings - model object (string)', () => {
    let promise = knockoutComposition.buildCompositionSettings({ model: "test" }, null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: null, viewModel: viewModelInstance, model: null });
    });
  });

  it('build settings - model object', () => {
    let promise = knockoutComposition.buildCompositionSettings({ model: { test: "prop" } }, null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: null, viewModel: { test: "prop" }, model: null });
    });
  });

  it('build settings - model and view object', () => {
    let promise = knockoutComposition.buildCompositionSettings({ model: { test: "prop" }, view: "test.html" }, null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: "test.html", viewModel: { test: "prop" }, model: null });
    });
  });

  it('build settings - instance object', () => {
    let promise = knockoutComposition.buildCompositionSettings({ test: "prop" }, null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: null, viewModel: { test: "prop" }, model: null });
    });
  });

  it('build settings - activationData', () => {
    let promise = knockoutComposition.buildCompositionSettings({ view: "test.html", activationData: { id: 5, name: "john" } }, null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: "test.html", viewModel: null, model: { id: 5, name: "john" } });
    });
  });

  it('build settings - constructor', () => {
    let func = function () {
      return { id: 1 }
    };

    let promise = knockoutComposition.buildCompositionSettings(func, null);

    promise.then((settings: any) => {
      expect(settings).toBe({ view: null, viewModel: { id: 1 }, model: null });
    });
  });
});
