System.register(["aurelia-binding", "aurelia-templating", "aurelia-dependency-injection", "knockout"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_binding_1, aurelia_templating_1, aurelia_dependency_injection_1, ko, KnockoutBindable;
    return {
        setters: [
            function (aurelia_binding_1_1) {
                aurelia_binding_1 = aurelia_binding_1_1;
            },
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            },
            function (ko_1) {
                ko = ko_1;
            }
        ],
        execute: function () {
            KnockoutBindable = class KnockoutBindable {
                constructor(observerLocator) {
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
                applyBindableValues(data, target, applyOnlyObservables) {
                    data = data || {};
                    target = target || {};
                    applyOnlyObservables = applyOnlyObservables === undefined ? true : applyOnlyObservables;
                    let keys = Object.keys(data);
                    keys.forEach((key) => {
                        let outerValue = data[key];
                        let isObservable = ko.isObservable(outerValue);
                        if (isObservable || !applyOnlyObservables) {
                            let observer = this.getObserver(target, key);
                            if (observer && observer instanceof aurelia_templating_1.BehaviorPropertyObserver) {
                                observer.setValue(isObservable ? ko.unwrap(outerValue) : outerValue);
                            }
                            if (isObservable) {
                                this.subscriptions.push(outerValue.subscribe((newValue) => {
                                    observer.setValue(newValue);
                                }));
                            }
                        }
                    });
                    let originalUnbind = target.unbind;
                    target.unbind = () => {
                        this.subscriptions.forEach((subscription) => {
                            subscription.dispose();
                        });
                        this.subscriptions = [];
                        if (originalUnbind) {
                            originalUnbind.call(target);
                        }
                    };
                }
                /** internal: do not use */
                getObserver(target, key) {
                    return this.observerLocator.getObserver(target, key);
                }
            };
            KnockoutBindable = __decorate([
                aurelia_dependency_injection_1.inject(aurelia_binding_1.ObserverLocator)
            ], KnockoutBindable);
            exports_1("KnockoutBindable", KnockoutBindable);
        }
    };
});
