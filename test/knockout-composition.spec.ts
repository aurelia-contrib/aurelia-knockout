import {KnockoutComposition} from '../src/knockout-composition';
import * as ko from "knockout";
import test from 'ava';

let knockoutComposition: any;
let viewModel: any;
let viewModelPromise: Promise<any>;

test.beforeEach(t => {
  viewModel = { prop: "myInstance", test: () => { } };
  viewModelPromise = Promise.resolve(viewModel);

  knockoutComposition = new KnockoutComposition(<any>null, <any>null, <any>null);
  knockoutComposition.getViewModelInstance = () => viewModelPromise;
});

test('registers knockout custom binding', t => {
  knockoutComposition.register();
  t.not(ko.bindingHandlers["compose"], undefined);
});

test('build settings - null values', async t => {
  const settings = await knockoutComposition.buildCompositionSettings(null, null);

  t.deepEqual(settings, { view: null, viewModel: null, model: null });
});

test('build settings - html view', async t => {
  const settings = await knockoutComposition.buildCompositionSettings("test.html", null);

  t.deepEqual(settings, { view: "test.html", viewModel: viewModel, model: null });
});

test('build settings - moduleId', async t => {
  const settings = await knockoutComposition.buildCompositionSettings("test", null);

  t.deepEqual(settings, { view: null, viewModel: viewModel, model: null });
});

test('build settings - view object', async t => {
  const settings = await knockoutComposition.buildCompositionSettings({ view: "test.html" }, { prop: "context" });

  t.deepEqual(settings, { view: "test.html", viewModel: { prop: "context" }, model: null });
});

test('build settings - model object (string)', async t => {
  const settings = await knockoutComposition.buildCompositionSettings({ model: "test" }, null);

  t.deepEqual(settings, { view: null, viewModel: viewModel, model: null });
});

test('build settings - model object', async t => {
  const settings = await knockoutComposition.buildCompositionSettings({ model: { test: "prop" } }, null);

  t.deepEqual(settings, { view: null, viewModel: { test: "prop" }, model: null });
});

test('build settings - model and view object', async t => {
  const settings = await knockoutComposition.buildCompositionSettings({ model: { test: "prop" }, view: "test.html" }, null);

  t.deepEqual(settings, { view: "test.html", viewModel: { test: "prop" }, model: null });
});

test('build settings - instance object', async t => {
  const settings = await knockoutComposition.buildCompositionSettings({ test: "prop" }, null);

  t.deepEqual(settings, { view: null, viewModel: { test: "prop" }, model: null });
});

test('build settings - activationData', async t => {
  const settings = await knockoutComposition.buildCompositionSettings({ view: "test.html", activationData: { id: 5, name: "john" } }, null);

  t.deepEqual(settings, { view: "test.html", viewModel: null, model: { id: 5, name: "john" } });
});

test('build settings - constructor', async t => {
  const settings = await knockoutComposition.buildCompositionSettings(() => { return { id: 1 }; }, null);

  t.deepEqual(settings, { view: null, viewModel: { id: 1 }, model: null });
});

