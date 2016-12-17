export * from "./knockout-bindable";
export * from "./knockout-composition";
export * from "./knockout-custom-attribute";
export * from "./require-polyfill";

import {KnockoutCustomAttribute} from './knockout-custom-attribute';
import {KnockoutComposition} from './knockout-composition';
import {RequirePolyfill} from './require-polyfill';
import {Container} from "aurelia-dependency-injection";

export function configure(frameworkConfig: { container: Container, globalResources: (...resources: string[]) => any }) {
  // register custom attribute
  frameworkConfig.globalResources('./knockout-custom-attribute');

  // register knockout custom binding for composition logic
  frameworkConfig.container.get(KnockoutComposition).register();

  // register require function in window object if not available
  frameworkConfig.container.get(RequirePolyfill).register();

  // register stopKoBindings custom binding
  KnockoutCustomAttribute.register();
}
