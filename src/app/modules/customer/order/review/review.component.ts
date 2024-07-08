import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomPipesModule } from '@fuse/pipes/custom/custom-pipes.module';
import { Order } from 'app/types/order.type';
import { Observable } from 'rxjs';
import { OrderService } from '../order.service';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'review',
    standalone: true,
    templateUrl: 'review.component.html',
    imports: [CommonModule, CustomPipesModule, MatIconModule, MatButtonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, FuseAlertComponent]
})

export class ReviewComponent implements OnInit {

    order$: Observable<Order>;
    isLoading: boolean = false;
    reviewForms: UntypedFormGroup[] = [];
    stars: number[] = [1, 2, 3, 4, 5]
    ratings: number[] = [];

    constructor(
        private _orderService: OrderService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this.order$ = this._orderService.order$;
        this.initReviewFormArary();
    }

    private initReviewFormArary() {
        this.order$.subscribe(order => {
            order.orderDetails.forEach(orderDetail => {
                const reviewForm = this._formBuilder.group({
                    productId: [orderDetail.product.id, Validators.required],
                    orderDetailId: [orderDetail.id, Validators.required],
                    star: [0, Validators.required],
                    message: [null]
                });
                this.ratings.push(5);
                this.reviewForms.push(reviewForm);
            })
        })
    }

    onSubmit(index: number, orderDetailId: string): void {
        this._fuseConfirmationService.open({
            title: 'Send feedback',
            message: 'Confirm to send your feedback for this product.',
            icon: {
                color: 'info'
            }
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._orderService.reviewProduct(this.reviewForms[index].value).subscribe(() => {
                    this._orderService.getOrderDetail(orderDetailId).subscribe();
                });
            }
        })
    }

    rate(index: number, rate: number) {
        this.ratings[index] = rate;
        this.reviewForms[index].controls['star'].setValue(rate);
    }
}