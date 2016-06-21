define(['exports', './knockout-custom-attribute', './knockout-composition', './knockout-bindable'], function (exports, _knockoutCustomAttribute, _knockoutComposition, _knockoutBindable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = exports.KnockoutBindable = exports.KnockoutCustomAttribute = undefined;


  function configure(frameworkConfig) {
    frameworkConfig.globalResources('./knockout-custom-attribute');

    frameworkConfig.container.get(_knockoutComposition.KnockoutComposition).register();

    _knockoutCustomAttribute.KnockoutCustomAttribute.register();
  }

  exports.KnockoutCustomAttribute = _knockoutCustomAttribute.KnockoutCustomAttribute;
  exports.KnockoutBindable = _knockoutBindable.KnockoutBindable;
  exports.configure = configure;
});