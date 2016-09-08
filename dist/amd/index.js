define(['exports', './aurelia-knockout'], function (exports, _aureliaKnockout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaKnockout).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaKnockout[key];
      }
    });
  });
});