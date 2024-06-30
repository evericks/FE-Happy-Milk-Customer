import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom/custom-pipes.module';
import { Order } from 'app/types/order.type';
import { Observable } from 'rxjs';
import { OrderService } from './order.service';

@Component({
    selector: 'order',
    standalone: true,
    templateUrl: 'order.component.html',
    imports: [CommonModule, MatIconModule, FuseCardComponent, RouterModule, MatButtonModule, CustomPipesModule]
})

export class OrderComponent implements OnInit {

    orders$: Observable<Order[]>;
    isLoading: boolean = false;

    constructor(
        private _orderService: OrderService
    ) { }

    ngOnInit() {
        this.orders$ = this._orderService.orders$;
    }
}