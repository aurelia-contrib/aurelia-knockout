import {KnockoutCustomAttribute} from './knockout-custom-attribute';
import {KnockoutComposition} from './knockout-composition';
import {KnockoutBindable} from './knockout-bindable';
import {RequirePolyfill} from './require-polyfill';

function configure(frameworkConfig) {
  // register custom attribute
  frameworkConfig.globalResources('./knockout-custom-attribute');

  // register knockout custom binding for composition logic
  frameworkConfig.container.get(KnockoutComposition).register();

  // register require function in window object if not available
  frameworkConfig.container.get(RequirePolyfill).register();

  // register stopKoBindings custom binding
  KnockoutCustomAttribute.register();
}

export {
  KnockoutCustomAttribute,
  KnockoutBindable,
  configure
};
