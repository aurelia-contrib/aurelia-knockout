var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ObserverLocator } from 'aurelia-binding';
import { BehaviorPropertyObserver } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import * as ko from 'knockout';
var KnockoutBindable = (function () {
    function KnockoutBindable(observerLocator) {
        this.subscriptions = [];
        this.observerLocator = observerLocator;
    }
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
    KnockoutBindable.prototype.applyBindableValues = function (data, target, applyOnlyObservables) {
        var _this = this;
        data = data || {};
        target = target || {};
        applyOnlyObservables = applyOnlyObservables === undefined ? true : applyOnlyObservables;
        var keys = Object.keys(data);
        keys.forEach(function (key) {
            var outerValue = data[key];
            var isObservable = ko.isObservable(outerValue);
            if (isObservable || !applyOnlyObservables) {
                var observer_1 = _this.getObserver(target, key);
                if (observer_1 && observer_1 instanceof BehaviorPropertyObserver) {
                    observer_1.setValue(isObservable ? ko.unwrap(outerValue) : outerValue);
                }
                if (isObservable) {
                    _this.subscriptions.push(outerValue.subscribe(function (newValue) {
                        observer_1.setValue(newValue);
                    }));
                }
            }
        });
        var originalUnbind = target.unbind;
        target.unbind = function () {
            _this.subscriptions.forEach(function (subscription) {
                subscription.dispose();
            });
            _this.subscriptions = [];
            if (originalUnbind) {
                originalUnbind.call(target);
            }
        };
    };
    /** internal: do not use */
    KnockoutBindable.prototype.getObserver = function (target, key) {
        return this.observerLocator.getObserver(target, key);
    };
    return KnockoutBindable;
}());
KnockoutBindable = __decorate([
    inject(ObserverLocator)
], KnockoutBindable);
export { KnockoutBindable };
