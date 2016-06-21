'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.KnockoutBindable = exports.KnockoutCustomAttribute = undefined;

var _knockoutCustomAttribute = require('./knockout-custom-attribute');

var _knockoutComposition = require('./knockout-composition');

var _knockoutBindable = require('./knockout-bindable');

function configure(frameworkConfig) {
  frameworkConfig.globalResources('./knockout-custom-attribute');

  frameworkConfig.container.get(_knockoutComposition.KnockoutComposition).register();

  _knockoutCustomAttribute.KnockoutCustomAttribute.register();
}

exports.KnockoutCustomAttribute = _knockoutCustomAttribute.KnockoutCustomAttribute;
exports.KnockoutBindable = _knockoutBindable.KnockoutBindable;
exports.configure = configure;