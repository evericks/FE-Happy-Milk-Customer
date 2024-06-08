import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'cart',
    standalone: true,
    templateUrl: './cart.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatIconModule, MatButtonModule, RouterModule]
})
export class CartComponent {
    items: any[] = []
    /**
     * Constructor
     */
    constructor() {
    }
}
