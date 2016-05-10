import { KnockoutCustomAttribute } from './aurelia-knockout-custom-attribute';
import { KnockoutComposition } from './knockout-composition';

function configure(frameworkConfig) {
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

  frameworkConfig.container.get(KnockoutComposition).register();
}

export { KnockoutCustomAttribute, configure };