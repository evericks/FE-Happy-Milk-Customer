import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderService } from './order.service';
import { OrderDetailComponent } from './detail/order-detail.component';
import { ReviewComponent } from './review/review.component';

export default [
    {
        path: '',
        component: OrderComponent,
        resolve: {
            orders: () => inject(OrderService).getOrders(),
        },
    },
    {
        path: ':id',
        component: OrderDetailComponent,
        resolve: {
            order: (route: ActivatedRouteSnapshot) => inject(OrderService).getOrderById(route.params['id']),
        },
    },
    {
        path: ':id/reviews',
        component: ReviewComponent,
        resolve: {
            order: (route: ActivatedRouteSnapshot) => inject(OrderService).getOrderById(route.params['id']),
        },
    },
] as Routes;
