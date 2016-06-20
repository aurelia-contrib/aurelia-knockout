'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.KnockoutBindable = exports.KnockoutCustomAttribute = undefined;

var _aureliaKnockoutCustomAttribute = require('./aurelia-knockout-custom-attribute');

var _knockoutComposition = require('./knockout-composition');

var _knockoutBindable = require('./knockout-bindable');

function configure(frameworkConfig) {
  frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

  frameworkConfig.container.get(_knockoutComposition.KnockoutComposition).register();

  _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute.register();
}

exports.KnockoutCustomAttribute = _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute;
exports.KnockoutBindable = _knockoutBindable.KnockoutBindable;
exports.configure = configure;