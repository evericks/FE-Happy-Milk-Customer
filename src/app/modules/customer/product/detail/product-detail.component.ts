import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'product-detail',
    standalone: true,
    templateUrl: './product-detail.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent {
    isLoading: boolean = false;
    /**
     * Constructor
     */
    constructor() {
    }
}
