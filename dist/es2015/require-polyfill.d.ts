import { Loader } from 'aurelia-loader';
export declare class RequirePolyfill {
    loader: Loader;
    constructor(loader: Loader);
    /**
     * Registers the `require` function if not set.
     */
    register(): void;
}
