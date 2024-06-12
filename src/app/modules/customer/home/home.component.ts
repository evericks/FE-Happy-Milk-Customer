import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { CheckboxListComponent } from 'app/modules/custom-components/checkbox-list/checkbox-list.box.component';
import { Category } from 'app/types/category.type';
import { Product } from 'app/types/product.type';
import { Observable, Subject, debounceTime, filter, map, switchMap, takeUntil } from 'rxjs';
import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'home',
    standalone: true,
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatIconModule, MatInputModule, CheckboxListComponent, FuseCardComponent, RouterModule]
})
export class HomeComponent implements OnInit {

    isLoading: boolean = false;
    search: string;
    filterForm: UntypedFormGroup;

    products$: Observable<Product[]>;
    categories$: Observable<Category[]>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _productService: ProductService,
        private _categoryService: CategoryService
    ) { }

    ngOnInit(): void {

        // Get the products
        this.products$ = this._productService.products$;

        // Get the categories
        this.categories$ = this._categoryService.categories$;

        this.initFilterForm();
        this.subcribeFilterForm();
    }

    private initFilterForm() {
        this.filterForm = this._formBuilder.group({
            search: [null],
            categories: [null],
            pageSize: [null],
            pageNumber: [null]
        });
    }

    private subcribeFilterForm() {
        this.filterForm.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            filter(() => this.filterForm.valid),
            debounceTime(500),
            switchMap((filter) => {
                this.isLoading = true;
                let result = this._productService.getProducts(filter);
                return result;
            }),
            map(() => {
                this.isLoading = false;
            })
        ).subscribe();
    }

    onCategoriesChanged(selectedCheckbox: string[]) {
        this.filterForm.controls['categories'].setValue(selectedCheckbox);
        console.log(this.filterForm.value);
    }
}
