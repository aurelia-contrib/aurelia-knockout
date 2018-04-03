import { InternalPropertyObserver, ObserverLocator } from 'aurelia-binding';
export declare class KnockoutBindable {
    observerLocator: ObserverLocator;
    subscriptions: any[];
    constructor(observerLocator: ObserverLocator);
    /**
     * Applys all values from a data object (usually the activation data) to the corresponding instance fields
     * in the current view model if they are marked as @bindable. By default all matching values from the data object
     * are applied. To only apply observable values set the last parameter to `true`. Subscriptions are created
     * for all Knockout observables in the data object to update the view-model values respectively.
     *
     * @param data - the data object
     * @param target - the target view model
     * @param applyOnlyObservables - `true` if only observable values should be applied, false by default.
     */
    applyBindableValues(data: any, target: any, applyOnlyObservables: boolean): void;
    /** internal: do not use */
    getObserver(target: any, key: string): InternalPropertyObserver;
}
