import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Product } from 'app/types/product.type';
import { Observable } from 'rxjs';
import { ProductService } from '../product.service';
import { CartService } from 'app/layout/common/cart/cart.service';
import { Cart } from 'app/types/cart.type';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'product-detail',
    standalone: true,
    templateUrl: './product-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
    product$: Observable<Product>;
    quantity: number = 1;
    isLoading: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _productService: ProductService,
        private _cartService: CartService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        this.product$ = this._productService.product$;
    }

    addToCart(productId: string) {
        if (this._authService.isAuthenticated) {

            var item = {
                productId: productId,
                quantity: this.quantity
            }
            this._cartService.addToCart(item).subscribe(() => {

            }, error => {
                this._fuseConfirmationService.open({
                    title: 'Warning',
                    message: error.error,
                    actions: {
                        confirm: {
                            show: false
                        }
                    },
                    icon: {
                        color: 'info'
                    }
                });
            });
        } else {
            this._router.navigate(['/sign-in']);
        }
    }

}