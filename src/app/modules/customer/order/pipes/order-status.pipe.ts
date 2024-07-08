import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

    transform(status: string): any {
        switch (status) {
            case 'Pending':
                return { class: 'text-orange-500 icon-size-16', icon: 'hourglass_empty' };
            case 'Confirmed':
                return { class: 'text-violet-500 icon-size-16', icon: 'check_circle' };
            case 'Paid':
                return { class: 'text-blue-500 icon-size-16', icon: 'payment' };
            case 'Delivering':
                return { class: 'text-pink-500 icon-size-16', icon: 'local_shipping' };
            case 'Canceled':
                return { class: 'text-gray-500 icon-size-16', icon: 'cancel' };
            case 'Completed':
                return { class: 'text-green-500 icon-size-16', icon: 'done_all' };
            default:
                return { class: '', icon: '' };
        }
    }
}
