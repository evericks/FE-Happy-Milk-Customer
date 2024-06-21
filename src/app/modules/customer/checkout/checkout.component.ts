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
import { Observable, Subject, catchError, debounceTime, filter, map, of, switchMap, take } from 'rxjs';
import { OrderService } from '../order/order.service';
import { forEach } from 'lodash';
import { FuseAlertComponent } from '@fuse/components/alert';

@Component({
    selector: 'checkout',
    standalone: true,
    templateUrl: './checkout.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule,
        MatRadioModule, MatButtonModule, FuseAlertComponent]
})
export class CheckoutComponent implements OnInit {
    private quantityChangeSubject = new Subject<{ cartId: string, cartItemId: string, quantity: any }>();

    cart$: Observable<Cart>;
    totalPrice: number = 0;
    cartItems: any[] = [];
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
        private _fuseConfirmationService: FuseConfirmationService,
        private _orderService: OrderService
    ) { }

    ngOnInit(): void {
        this.cart$ = this._cartService.cart$;
        this.initCheckoutForm();
        this._cartService.cart$.subscribe(cart => {
            if (cart) {
                this.calculateTotalPrice(cart);
                this.calculateCartItems(cart);
                this.setCheckoutFormValue();
            }
        });
        this.subscribeQuantityChange();
    }

    initCheckoutForm() {
        this.checkoutForm = this._formBuilder.group({
            amount: [null, [Validators.required]],
            receiver: [null, [Validators.required]],
            address: [null, [Validators.required, Validators.minLength(10)]],
            phone: [null, [Validators.required, Validators.minLength(10)]],
            paymentMethod: ['Cash', [Validators.required]],
            orderDetails: [null, [Validators.required]]
        });
    }

    private calculateTotalPrice(cart: Cart) {
        this.totalPrice = cart.cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
    }

    private calculateCartItems(cart: Cart) {
        cart.cartItems.forEach(item => {
            const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.productId === item.product.id);
            const newItem = {
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            };
            if (existingItemIndex !== -1) {
                this.cartItems[existingItemIndex] = newItem;
            } else {
                this.cartItems.push(newItem);
            }
        });
    }

    private setCheckoutFormValue() {
        this.checkoutForm.controls['amount'].setValue(this.totalPrice);
        this.checkoutForm.controls['orderDetails'].setValue(this.cartItems);
    }

    public onQuantityChange(cartId: string, cartItemId: string, quantity: any) {
        this.quantityChangeSubject.next({ cartId, cartItemId, quantity });
    }

    private subscribeQuantityChange() {
        this.quantityChangeSubject.pipe(
            filter(({ quantity }) => quantity !== null),
            debounceTime(500),
            switchMap(({ cartId, cartItemId, quantity }) => {
                var updateCartItem = {
                    id: cartItemId,
                    quantity: quantity
                };
                return this._cartService.updateCartItem(cartId, updateCartItem).pipe(
                    catchError(error => {
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
                        return of(null);
                    })
                );
            })
        ).subscribe(response => {
            // Xử lý response nếu cần
        });
    }

    public submitCheckout() {
        this._fuseConfirmationService.open({
            title: 'Information',
            message: 'Xác nhận tạo đơn hàng?',
            icon: {
                color: 'info'
            }
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._orderService.createOrder(this.checkoutForm.value).subscribe(() => {
                    this._cartService.getCart().subscribe(() => {
                        this._fuseConfirmationService.open({
                            title: 'Information',
                            message: 'Đơn hàng đã được tạo thành công',
                            icon: {
                                color: 'info'
                            },
                            actions: {
                                confirm: {
                                    show: false
                                },
                                cancel: {
                                    label: 'Xác nhận'
                                }
                            }
                        })
                    });
                }, error => {
                    this._fuseConfirmationService.open({
                        title: 'Information',
                        message: error.error,
                        icon: {
                            color: 'info'
                        },
                        actions: {
                            confirm: {
                                show: false
                            },
                            cancel: {
                                label: 'Xác nhận'
                            }
                        }
                    })
                })
            }
        })
    }

    public removeCartItem(id: string) {
        this._fuseConfirmationService.open({
            title: 'Remove cart item?'
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._cartService.deleteCartItem(id).subscribe();
            }
        })
    }
}