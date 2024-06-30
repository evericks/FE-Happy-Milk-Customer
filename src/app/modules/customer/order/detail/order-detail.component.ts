import { Component, OnInit } from '@angular/core';
import { Order } from 'app/types/order.type';
import { Observable } from 'rxjs';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { CustomPipesModule } from '@fuse/pipes/custom/custom-pipes.module';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'order-detail',
    standalone: true,
    templateUrl: 'order-detail.component.html',
    imports: [CommonModule, CustomPipesModule, MatIconModule]
})

export class OrderDetailComponent implements OnInit {

    order$: Observable<Order>;
    isLoading: boolean = false;

    constructor(
        private _orderService: OrderService
    ) { }

    ngOnInit() {
        this.order$ = this._orderService.order$;
    }
}