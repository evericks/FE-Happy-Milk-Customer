import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductService } from './product.service';
import { inject } from '@angular/core';
import { FeedbackService } from '../feedback/feedback.service';
import { forkJoin } from 'rxjs';

export default [
    {
        path: ':id',
        component: ProductDetailComponent,
        resolve: {
            data: (route: ActivatedRouteSnapshot) => {
                const productService = inject(ProductService);
                const feedbackService = inject(FeedbackService);
                return forkJoin({
                    products: productService.getProductById(route.params['id']),
                    categories: feedbackService.getProductFeedbacks(route.params['id']),
                });
            },
        },
    },
] as Routes;
