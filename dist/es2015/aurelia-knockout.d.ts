export * from "./knockout-bindable";
export * from "./knockout-composition";
export * from "./knockout-custom-attribute";
export * from "./require-polyfill";
import { Container } from "aurelia-dependency-injection";
export declare function configure(frameworkConfig: {
    container: Container;
    globalResources: (...resources: string[]) => any;
}): void;
