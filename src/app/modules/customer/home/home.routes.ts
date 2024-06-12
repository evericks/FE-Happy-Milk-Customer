import { Routes } from '@angular/router';
import { HomeComponent } from 'app/modules/customer/home/home.component';
import { ProductService } from '../product/product.service';
import { inject } from '@angular/core';
import { CategoryService } from '../category/category.service';

export default [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            products: () => inject(ProductService).getProducts(),
            categories: () => inject(CategoryService).getCategories(),
        },
    },
] as Routes;
