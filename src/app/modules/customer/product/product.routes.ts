import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductService } from './product.service';
import { inject } from '@angular/core';

export default [
    {
        path: ':id',
        component: ProductDetailComponent,
        resolve: {
            product: (route: ActivatedRouteSnapshot) => inject(ProductService).getProductById(route.params['id']),

        },
    },
] as Routes;
