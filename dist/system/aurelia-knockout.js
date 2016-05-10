'use strict';

System.register(['./aurelia-knockout-custom-attribute', './knockout-composition'], function (_export, _context) {
  var KnockoutCustomAttribute, KnockoutComposition;


  function configure(frameworkConfig) {
    frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

    frameworkConfig.container.get(KnockoutComposition).register();
  }

  return {
    setters: [function (_aureliaKnockoutCustomAttribute) {
      KnockoutCustomAttribute = _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute;
    }, function (_knockoutComposition) {
      KnockoutComposition = _knockoutComposition.KnockoutComposition;
    }],
    execute: function () {
      _export('KnockoutCustomAttribute', KnockoutCustomAttribute);

      _export('configure', configure);
    }
  };
});