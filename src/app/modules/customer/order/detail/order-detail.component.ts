import { Component, OnInit } from '@angular/core';
import { Order } from 'app/types/order.type';
import { Observable } from 'rxjs';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { CustomPipesModule } from '@fuse/pipes/custom/custom-pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'order-detail',
    standalone: true,
    templateUrl: 'order-detail.component.html',
    imports: [CommonModule, CustomPipesModule, MatIconModule, MatButtonModule, RouterModule]
})

export class OrderDetailComponent implements OnInit {

    order$: Observable<Order>;
    isLoading: boolean = false;

    constructor(
        private _orderService: OrderService,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this.order$ = this._orderService.order$;
    }

    cancelOrder(id: string) {
        this._fuseConfirmationService.open({
            title: 'Cancel this order',
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._orderService.cancelOrder(id).subscribe();
            }
        })
    }

    completeOrder(id: string) {
        this._fuseConfirmationService.open({
            title: 'Complete this order',
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._orderService.completeOrder(id).subscribe();
            }
        })
    }
}