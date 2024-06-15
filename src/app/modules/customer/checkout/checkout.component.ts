import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CartService } from 'app/layout/common/cart/cart.service';
import { Cart } from 'app/types/cart.type';
import { Observable, Subject, catchError, debounceTime, map, of, switchMap, take } from 'rxjs';

@Component({
    selector: 'checkout',
    standalone: true,
    templateUrl: './checkout.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatRadioModule, MatButtonModule]
})
export class CheckoutComponent implements OnInit {
    private quantityChangeSubject = new Subject<{ cartId: string, cartItemId: string, quantity: any }>();

    cart$: Observable<Cart>;
    totalPrice: number;
    quantity: number = 3;
    paymentMethod: string;
    paymentMethods: string[] = ['VNPay', 'Momo', 'Cash', 'Visa'];
    isLoading: boolean = false;
    checkoutForm: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _cartService: CartService,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit(): void {
        this.cart$ = this._cartService.cart$;
        this._cartService.cart$.subscribe(cart => {
            if (cart) {
                this.totalPrice = cart.cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
            }
        })
        this.initCheckoutForm();
        this.subscribeQuantityChange();
    }

    initCheckoutForm() {
        this.checkoutForm = this._formBuilder.group({
            customerId: [null, [Validators.required]],
            amount: [null, [Validators.required]],
            receiver: ['null', [Validators.required]],
            address: [null, [Validators.required]],
            phone: [null, [Validators.required]],
            paymentMethod: ['Cash', [Validators.required]],
        });
    }

    checkValidQuantity(event: any) {
        const key = event.key;
        if (this.isNumberKey(key)) {
            if (this.quantity < 1 || this.quantity > 999) {
                console.log('cút');
            }
        }
    }

    onQuantityChange(cartId: string, cartItemId: string, quantity: any) {
        this.quantityChangeSubject.next({ cartId, cartItemId, quantity });
    }

    subscribeQuantityChange() {
        this.quantityChangeSubject.pipe(
            debounceTime(500), // Đợi 1 giây sau khi không còn thay đổi
            switchMap(({ cartId, cartItemId, quantity }) => {
                var updateCartItem = {
                    id: cartItemId,
                    quantity: quantity
                };
                return this._cartService.updateCartItem(cartId, updateCartItem).pipe(
                    catchError(error => {
                        return of(null); // Trả về Observable null để tiếp tục luồng
                    })
                );
            })
        ).subscribe(response => {
            // Xử lý response nếu cần
        });
    }

    isNumberKey(key: string): boolean {
        const numberKeys = '0123456789';
        return numberKeys.includes(key);
    }

    submitCheckout() {
        console.log('checkout');

        if (this.checkoutForm.valid) {
            console.log('valid');
        }
    }

    removeCartItem(id: string) {
        this._fuseConfirmationService.open({
            title: 'Remove cart item?'
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._cartService.deleteCartItem(id).subscribe();
            }
        })
    }
}