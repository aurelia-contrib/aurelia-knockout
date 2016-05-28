import {KnockoutCustomAttribute} from './aurelia-knockout-custom-attribute';
import {KnockoutComposition} from './knockout-composition';
import {KnockoutBindable} from './knockout-bindable';

function configure(frameworkConfig) {
  // register custom attribute
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

  // register knockout custom binding for composition logic
  frameworkConfig.container.get(KnockoutComposition).register();
}

export {
  KnockoutCustomAttribute,
  KnockoutBindable,
  configure
};
