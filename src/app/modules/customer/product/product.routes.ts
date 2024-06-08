import { Routes } from '@angular/router';
import { ProductDetailComponent } from './detail/product-detail.component';

export default [
    {
        path: ':id',
        component: ProductDetailComponent,
    },
] as Routes;
