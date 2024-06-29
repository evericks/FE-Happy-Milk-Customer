import { Routes } from '@angular/router';
import { HomeComponent } from 'app/modules/customer/home/home.component';
import { ProductService } from '../product/product.service';
import { inject } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { forkJoin } from 'rxjs';

export default [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            data: () => {
                const productService = inject(ProductService);
                const categoryService = inject(CategoryService);
                return forkJoin({
                    products: productService.getProducts(),
                    categories: categoryService.getCategories(),
                });
            },
        },
    },
] as Routes;
