define(['exports', './aurelia-knockout-custom-attribute', './knockout-composition', './knockout-bindable'], function (exports, _aureliaKnockoutCustomAttribute, _knockoutComposition, _knockoutBindable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = exports.KnockoutBindable = exports.KnockoutCustomAttribute = undefined;


  function configure(frameworkConfig) {
    frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

    frameworkConfig.container.get(_knockoutComposition.KnockoutComposition).register();

    _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute.register();
  }

  exports.KnockoutCustomAttribute = _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute;
  exports.KnockoutBindable = _knockoutBindable.KnockoutBindable;
  exports.configure = configure;
});