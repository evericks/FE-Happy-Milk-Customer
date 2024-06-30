import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from 'app/modules/customer/order/pipes/order-status.pipe';

@NgModule({
    declarations: [OrderStatusPipe],
    imports: [CommonModule],
    exports: [OrderStatusPipe]
})
export class CustomPipesModule { }
