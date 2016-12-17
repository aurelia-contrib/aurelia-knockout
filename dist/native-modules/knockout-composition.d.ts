import { Container } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { CompositionEngine } from 'aurelia-templating';
export declare class KnockoutComposition {
    compositionEngine: CompositionEngine;
    container: Container;
    loader: Loader;
    constructor(compositionEngine: CompositionEngine, container: Container, loader: Loader);
    /**
     * Registers the `compose` Knockout Binding to use Compositions in your Views.
     */
    register(): void;
    /** internal: do not use */
    buildCompositionSettings(value: any, bindingContext: any): Promise<any>;
    /** internal: do not use */
    getViewModelInstance(moduleId: string): Promise<any>;
}
