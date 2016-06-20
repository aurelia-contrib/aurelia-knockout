'use strict';

System.register(['./aurelia-knockout-custom-attribute', './knockout-composition', './knockout-bindable'], function (_export, _context) {
  "use strict";

  var KnockoutCustomAttribute, KnockoutComposition, KnockoutBindable;


  function configure(frameworkConfig) {
    frameworkConfig.globalResources('./aurelia-knockout-custom-attribute');

    frameworkConfig.container.get(KnockoutComposition).register();

    KnockoutCustomAttribute.register();
  }

  return {
    setters: [function (_aureliaKnockoutCustomAttribute) {
      KnockoutCustomAttribute = _aureliaKnockoutCustomAttribute.KnockoutCustomAttribute;
    }, function (_knockoutComposition) {
      KnockoutComposition = _knockoutComposition.KnockoutComposition;
    }, function (_knockoutBindable) {
      KnockoutBindable = _knockoutBindable.KnockoutBindable;
    }],
    execute: function () {
      _export('KnockoutCustomAttribute', KnockoutCustomAttribute);

      _export('KnockoutBindable', KnockoutBindable);

      _export('configure', configure);
    }
  };
});