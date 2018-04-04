# Changelog

## Version 2.2.0

Released on April 04, 2018.

-   Updated dependencies
-   Refactored unit-tests to use ava and sinon instead of jasmine.
-   Moved migration guide to docs folder from wiki.
-   Moved repository to aurelia-contrib organization.


## Version 2.1.0

Released on December 17, 2017.

-   Use "transient" lifetime for composed view-models. [#22](https://github.com/aurelia-contrib/aurelia-knockout/issues/22)


## Version 2.0.2

Released on October 26, 2017.

-   Fixed wrong transpilations in `dist` folder [#20](https://github.com/aurelia-contrib/aurelia-knockout/issues/20)


## Version 2.0.1

Released on January 21, 2017.

-   Use `PLATFORM.moduleName(...)` to include resource.


## Version 2.0.0

Released on December 17, 2016.

-   Ported whole codebase to TypeScript.
-   Dropped Support for JSPM.
-   Added `require` polyfill function to browsers `window` context.


## Version 1.0.2

Released on September 08, 2016.

-   Allow Composition with virtual Knockout binding.


## Version 1.0.1

Released on June 21, 2016.

-   Knockout Binding fails if views are nested recursive. Fixes [#5](https://github.com/aurelia-contrib/aurelia-knockout/issues/5)


## Version 1.0.0

Released on June 19, 2016.

-   Updated build infrastructure
-   Updated dependencies
-   Added code docs
-   Added typings support
-   Shrunk typescript definitions


## Version 0.2.2

Released on June 15, 2016.

-   Composition failed if backing view-model returns an instance instead of returning or exporting the constructor function. Fixes [#4](https://github.com/aurelia-contrib/aurelia-knockout/issues/4)
-   Documentation fixes


## Version 0.2.1

Released on June 14, 2016.

-   Added missing aurelia dependencies in ```package.json``` and ```config.json```. Fixes [#3](https://github.com/aurelia-contrib/aurelia-knockout/issues/3)


## Version 0.2.0

Released on May 28, 2016.

-   Fixed typo in knockout-custom-attribute module
-   Added ability to set and update bindable variables in subsequent Aurelia views from parent knockout views


## Version 0.1.2

Released on May 12, 2016.

-   Added Usage documentation. Issue [#1](https://github.com/aurelia-contrib/aurelia-knockout/issues/1)


## Version 0.1.1

Released on May 12, 2016.

-   Added JSPM registry name to package.json


## Version 0.1.0

Released on May 11, 2016.

-   First public release.
