import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartItem } from 'app/types/cart-item.type';
import { Cart } from 'app/types/cart.type';
import { BehaviorSubject, Observable, map, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {

    private _cart: BehaviorSubject<Cart | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for cart
 */
    get cart$(): Observable<Cart> {
        return this._cart.asObservable();
    }

    /**
     * Get cart by id
     */
    getCart(): Observable<Cart> {
        return this.cart$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Cart>('/api/carts').pipe(
                map((cart) => {

                    // Set value for current cart
                    this._cart.next(cart);

                    // Return the new contact
                    return cart;
                })
            ))
        );
    }

    /**
* Add to cart
*/
    addToCart(data) {
        return this.cart$.pipe(
            take(1),
            switchMap(() => this._httpClient.post<Cart>('/api/carts', data).pipe(
                map((cart) => {

                    // Update cart
                    this._cart.next(cart);

                    return cart;
                })
            ))
        )
    }

    /**
    * Update cart item
    */
    updateCartItem(id: string, data: any) {
        return this.cart$.pipe(
            take(1),
            switchMap((cart) => this._httpClient.put<CartItem>('/api/carts/items/' + id, data).pipe(
                map((cartItem) => {

                    // Find and replace updated cart
                    const index = cart.cartItems.findIndex(item => item.id === cartItem.id);
                    cart.cartItems[index] = cartItem;

                    // Update cart
                    this._cart.next(cart);

                    return cartItem;
                })
            ))
        )
    }

    /**
    * Remove cart item
    */
    deleteCartItem(id: string): Observable<boolean> {
        return this.cart$.pipe(
            take(1),
            switchMap(cart => this._httpClient.delete('/api/carts/items/' + id).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted product
                    const index = cart.cartItems.findIndex(item => item.id === id);

                    // Delete the product
                    cart.cartItems.splice(index, 1);

                    // Update the invoices
                    this._cart.next(cart);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }
}