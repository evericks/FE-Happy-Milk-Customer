import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Cart } from 'app/types/cart.type';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cart',
    standalone: true,
    templateUrl: './cart.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule]
})
export class CartComponent implements OnInit {
    cart$: Observable<Cart>;
    /**
     * Constructor
     */
    constructor(private _cartService: CartService) {
    }

    ngOnInit(): void {
        this._cartService.getCart().subscribe();
        this.cart$ = this._cartService.cart$;
    }
}