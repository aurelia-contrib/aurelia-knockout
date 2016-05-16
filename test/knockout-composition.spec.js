import {KnockoutComposition} from '../src/knockout-composition';
import {Map} from "core-js/es6/map";

describe('knockout composition', function() {
  var knockoutComposition;
  var viewModelInstance;

  window.Map = Map;

  beforeEach(() => {
    viewModelInstance = Promise.resolve({ prop: "myInstance", test: () => {} });

    knockoutComposition = new KnockoutComposition(null, null, null);
    knockoutComposition.loadModule = jasmine.createSpy("loadModule func").and.returnValue(viewModelInstance);
  });

  it('registers knockout custom binding', () => {
    knockoutComposition.register();

    expect(ko.bindingHandlers.compose).toBeDefined();
  });

  it('build settings - null values', () => {
    var promise = knockoutComposition.buildCompositionSettings(null, null);

    promise.then((settings) => {
      expect(settings).toBe({ view: null, viewModel: null, model: null });
    });
  });

  it('build settings - html view', () => {
    var promise = knockoutComposition.buildCompositionSettings("test.html", null);

    promise.then((settings) => {
      expect(settings).toBe({ view: "test.html", viewModel: "test", model: null });
    });
  });

  it('build settings - moduleId', () => {
    var promise = knockoutComposition.buildCompositionSettings("test", null);

    promise.then((settings) => {
      expect(settings).toBe({ view: null, viewModel: viewModelInstance, model: null });
    });
  });

  it('build settings - view object', () => {
    var promise = knockoutComposition.buildCompositionSettings({ view: "test.html" }, { prop: "context" });

    promise.then((settings) => {
      expect(settings).toBe({ view: "test.html", viewModel: { prop: "context" }, model: null });
    });
  });

  it('build settings - model object (string)', () => {
    var promise = knockoutComposition.buildCompositionSettings({ model: "test" }, null);

    promise.then((settings) => {
      expect(settings).toBe({ view: null, viewModel: viewModelInstance, model: null });
    });
  });

  it('build settings - model object', () => {
    var promise = knockoutComposition.buildCompositionSettings({ model: { test: "prop" } }, null);

    promise.then((settings) => {
      expect(settings).toBe({ view: null, viewModel: { test: "prop" }, model: null });
    });
  });

  it('build settings - model and view object', () => {
    var promise = knockoutComposition.buildCompositionSettings({ model: { test: "prop" }, view: "test.html" }, null);

    promise.then((settings) => {
      expect(settings).toBe({ view: "test.html", viewModel: { test: "prop" }, model: null });
    });
  });

  it('build settings - instance object', () => {
    var promise = knockoutComposition.buildCompositionSettings({ test: "prop" }, null);

    promise.then((settings) => {
      expect(settings).toBe({ view: null, viewModel: { test: "prop" }, model: null });
    });
  });

  it('build settings - activationData', () => {
    var promise = knockoutComposition.buildCompositionSettings({ view: "test.html", activationData: { id: 5, name: "john" } }, null);

    promise.then((settings) => {
      expect(settings).toBe({ view: "test.html", viewModel: null, model: { id: 5, name: "john" } });
    });
  });

  it('build settings - constructor', () => {
    var func = function () {
      return { id: 1 }
    };

    var promise = knockoutComposition.buildCompositionSettings(func, null);

    promise.then((settings) => {
      expect(settings).toBe({ view: null, viewModel: { id: 1 }, model: null });
    });
  });
});
