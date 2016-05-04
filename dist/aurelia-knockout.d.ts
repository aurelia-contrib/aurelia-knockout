declare module 'aurelia-knockout' {
  import {
    inject
  } from 'aurelia-dependency-injection';
  import {
    customAttribute
  } from 'aurelia-templating';
  export class KnockoutCustomAttribute {
    constructor(element?: any);
    bind(executionContext?: any): any;
    unbdind(): any;
  }
}