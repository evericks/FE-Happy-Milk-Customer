import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'checkout',
    standalone: true,
    templateUrl: './checkout.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterModule, ReactiveFormsModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatRadioModule, MatButtonModule]
})
export class CheckoutComponent implements OnInit {
    quantity: number = 3;
    paymentMethod: string;
    paymentMethods: string[] = ['VNPay', 'Momo', 'Cash', 'Visa'];
    isLoading: boolean = false;
    checkoutForm: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit(): void {
        this.initCheckoutForm();
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

}
