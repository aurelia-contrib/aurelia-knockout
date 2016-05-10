define(['exports', './aurelia-knockout-custom-attribute', './knockout-composition'], function (exports, _aureliaKnockoutCustomAttribute, _knockoutComposition) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = exports.KnockoutCustomAttribute = undefined;


  function configure(frameworkConfig) {
    frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

    frameworkConfig.container.get(_knockoutComposition.KnockoutComposition).register();
  }

  exports.KnockoutCustomAttribute = _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute;
  exports.configure = configure;
});