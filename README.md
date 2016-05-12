# Aurelia Knockout Plugin

[![Build Status](https://travis-ci.org/code-chris/aurelia-knockout.svg?branch=master)](https://travis-ci.org/code-chris/aurelia-knockout)
[![Coverage Status](https://coveralls.io/repos/code-chris/aurelia-knockout/badge.svg?branch=master&service=github)](https://coveralls.io/github/code-chris/aurelia-knockout?branch=master)
[![npm Version](https://img.shields.io/npm/v/aurelia-knockout.svg)](https://www.npmjs.com/package/aurelia-knockout)


## Dependencies

* [aurelia-templating](https://github.com/aurelia/templating)
* [knockout](https://github.com/knockout/knockout)

## Platform Support

This library can be used in the **browser** only.

## Usage

Register the plugin at the startup of Aurelia:

```
export function configure(aurelia) => {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin("aurelia-knockout");

    aurelia.start().then((a) => {
        a.setRoot("app", undefined);
    });
}
```

### Binding syntax

To use the knockout binding syntax in your HTML view you have to add the "knockout" custom attribute to a
html element which surrounds all elements which are using knockout syntax:

```
<template>
    <div knockout>
        <button data-bind="click: changeVisibility">Change Visibility</button>
        <div data-bind="if: isVisible">
            <span data-bind="text: firstName"></span>
            <br/>
            <span data-bind="text: lastName"></span>
        </div>
    </div>
</template>
```

This will apply all bindings from this element and its children to the current viewmodel. The bindingContext from
Aurelia's "bind" function will be used for that. You have to add the attribute to each view with knockout syntax.

### Compositions

If you used Durandal as your previous SPA-Framework you want to use compositions. You can see the syntax below.
As the syntax looks like knockout, the compose binding was not part of knockout itself. This plugin can handle the
old Durandal composition syntax.

```
<template>
    <div knockout>
        <button data-bind="click: switchView">Switch SubView</button>
        <hr>
        <div data-bind="compose: view"></div>

        <div data-bind="compose: 'testModel2.html'"></div>
    </div>
</template>
```

All cases from the [offical Durandal](http://durandaljs.com/documentation/Using-Composition.html) documentation should be covered:

```
<div data-bind="compose: 'path/to/view.html'"></div>
<div data-bind="compose: 'path/to/module'"></div>
<div data-bind="compose: { view: 'path/to/view.html' }"></div>
<div data-bind="compose: { model: 'path/to/module' }"></div>
<div data-bind="compose: { model: moduleInstance }"></div>
<div data-bind="compose: { view: 'path/to/view.html' model: 'path/to/module' }"></div>
<div data-bind="compose: { view: 'path/to/view.html' model: moduleInstance }"></div>
<div data-bind="compose: moduleInstance"></div>
<div data-bind="compose: moduleConstructorFunction"></div>
```

You can also pass an object as activationData which is passed as argument to the ```activate(activationData)``` function:
```
<div data-bind="compose: { model: 'path/to/module', activationData: data }"></div>
```

The composition logic can handle Knockout Observables as parameters as well. The previous composition will be replaced.
The following callback functions will be called:

```compositionComplete(element, parentElement)``` if the Aurelia completes the composition and
```detached(element, parentElement)``` before the composed view will be removed from the DOM.


## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.


## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```

