import { KnockoutCustomAttribute } from './aurelia-knockout-custom-attribute';
import { KnockoutComposition } from './knockout-composition';
import { KnockoutBindable } from './knockout-bindable';

function configure(frameworkConfig) {
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

  frameworkConfig.container.get(KnockoutComposition).register();

  KnockoutCustomAttribute.register();
}

export { KnockoutCustomAttribute, KnockoutBindable, configure };