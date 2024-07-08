import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Feedback } from 'app/types/feedback.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeedbackService {

    private _feedback: BehaviorSubject<Feedback | null> = new BehaviorSubject(null);
    private _feedbacks: BehaviorSubject<Feedback[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for feedback
 */
    get feedback$(): Observable<Feedback> {
        return this._feedback.asObservable();
    }

    /**
     * Getter for feedbacks
     */
    get feedbacks$(): Observable<Feedback[]> {
        return this._feedbacks.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getProductFeedbacks(productId: string):
        Observable<{ pagination: Pagination; data: Feedback[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Feedback[] }>(`/api/products/${productId}/feedbacks`).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._feedbacks.next(response.data);
            }),
        );
    }

    /**
     * Get feedback by id
     */
    getFeedbackById(id: string): Observable<Feedback> {
        return this.feedbacks$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Feedback>('/api/feedbacks/' + id).pipe(
                map((feedback) => {

                    // Set value for current feedback
                    this._feedback.next(feedback);

                    // Return the new contact
                    return feedback;
                })
            ))
        );
    }
}