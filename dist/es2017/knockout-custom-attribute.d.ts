export declare class KnockoutCustomAttribute {
    element: Element;
    constructor(element: Element);
    static register(): void;
    /** internal: do not use */
    bind(executionContext: any): void;
    /** internal: do not use */
    unbind(): void;
}
