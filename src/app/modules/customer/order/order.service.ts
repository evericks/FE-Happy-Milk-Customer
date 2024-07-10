import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Order } from 'app/types/order.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';
import { OrderDetail } from 'app/types/order-detail.type';

@Injectable({ providedIn: 'root' })
export class OrderService {

    private _order: BehaviorSubject<Order | null> = new BehaviorSubject(null);
    private _orders: BehaviorSubject<Order[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for order
 */
    get order$(): Observable<Order> {
        return this._order.asObservable();
    }

    /**
     * Getter for orders
     */
    get orders$(): Observable<Order[]> {
        return this._orders.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getOrders(filter: any = {}):
        Observable<{ pagination: Pagination; data: Order[] }> {
        return this._httpClient.post<{ pagination: Pagination; data: Order[] }>('/api/customers/orders', filter).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._orders.next(response.data);
            }),
        );
    }

    /**
     * Get order by id
     */
    getOrderById(id: string): Observable<Order> {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Order>('/api/orders/' + id).pipe(
                map((order) => {

                    // Set value for current order
                    this._order.next(order);

                    // Return the new contact
                    return order;
                })
            ))
        );
    }

    /**
* Create order
*/
    createOrder(data) {
        return this.orders$.pipe(
            take(1),
            switchMap((orders) => this._httpClient.post<Order>('/api/orders', data).pipe(
                map((newOrder) => {

                    // Update order list with current page size
                    // this._orders.next([newOrder, ...orders].slice(0, this._pagination.value.pageSize));

                    return newOrder;
                })
            ))
        )
    }

    /**
* Call VNPay
*/
    callVNPay(data) {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.post<any>('/api/payments/request', data).pipe(
                map((url) => {
                    return url;
                })
            ))
        )
    }

    /**
    * Update order
    */
    updateOrder(id: string, data) {
        return this.orders$.pipe(
            take(1),
            switchMap((orders) => this._httpClient.put<Order>('/api/orders/' + id, data).pipe(
                map((updatedOrder) => {

                    // Find and replace updated order
                    const index = orders.findIndex(item => item.id === id);
                    orders[index] = updatedOrder;
                    this._orders.next(orders);

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }

    /**
* Cancle order
*/
    cancelOrder(id: string) {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.put<Order>(`/api/orders/${id}/cancel`, { note: null }).pipe(
                map((updatedOrder) => {

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }

    /**
* Complete order
*/
    completeOrder(id: string) {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.put<Order>(`/api/orders/${id}/complete`, null).pipe(
                map((updatedOrder) => {

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }

    /**
* Get order detail
*/
    getOrderDetail(id: string) {
        return this.order$.pipe(
            take(1),
            switchMap((order) => this._httpClient.get<OrderDetail>('/api/orders/details/' + id,).pipe(
                map((orderDetail) => {

                    // Find and replace order detail
                    const index = order.orderDetails.findIndex(item => item.id === id);
                    order.orderDetails[index] = orderDetail;
                    this._order.next(order);
                    return orderDetail;
                })
            ))
        )
    }

    /**
* Create feedback
*/
    reviewProduct(data) {
        return this.orders$.pipe(
            take(1),
            switchMap(() => this._httpClient.post<any>('/api/feedbacks', data).pipe(
                map((feedback) => {
                    return feedback;
                })
            ))
        )
    }
}