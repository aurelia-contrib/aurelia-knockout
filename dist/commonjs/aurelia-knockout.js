'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.KnockoutCustomAttribute = undefined;

var _aureliaKnockoutCustomAttribute = require('./aurelia-knockout-custom-attribute');

var _knockoutComposition = require('./knockout-composition');

function configure(frameworkConfig) {
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

  frameworkConfig.container.get(_knockoutComposition.KnockoutComposition).register();
}

exports.KnockoutCustomAttribute = _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute;
exports.configure = configure;