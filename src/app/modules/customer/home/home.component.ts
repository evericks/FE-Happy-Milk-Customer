import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { AuthService } from 'app/core/auth/auth.service';
import { CartService } from 'app/layout/common/cart/cart.service';
import { CheckboxListComponent } from 'app/modules/custom-components/checkbox-list/checkbox-list.box.component';
import { Category } from 'app/types/category.type';
import { Product } from 'app/types/product.type';
import { Observable, Subject, debounceTime, filter, map, of, switchMap, takeUntil } from 'rxjs';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';

@Component({
    selector: 'home',
    standalone: true,
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatIconModule, MatInputModule, CheckboxListComponent, FuseCardComponent, RouterModule, FuseAlertComponent]
})
export class HomeComponent implements OnInit, AfterViewInit {

    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
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
        private _changeDetectorRef: ChangeDetectorRef,
        private _productService: ProductService,
        private _categoryService: CategoryService,
        private _cartService: CartService,
        private _authService: AuthService,
        private _router: Router
    ) { }

    ngOnInit(): void {

        // Get the products
        this.products$ = this._productService.products$;

        // Get the categories
        this.categories$ = this._categoryService.categories$;

        this.initFilterForm();
    }

    ngAfterViewInit(): void {
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
                console.log(filter);

                this._productService.getProducts(filter).subscribe();
                return of(true);
            }),
            map(() => {
                this.isLoading = false;
            })
        ).subscribe();
    }

    addToCart(productId: string) {
        if (this._authService.isAuthenticated) {
            var item = {
                productId: productId,
                quantity: 1
            }
            this._cartService.addToCart(item).subscribe(result => {

            }, error => {
                this.showFlashMessage('error', error.error, 3000);
            });
        } else {
            this._router.navigate(['/sign-in']);
        }
    }

    onCategoriesChanged(selectedCheckbox: string[]) {
        this.filterForm.controls['categories'].setValue(selectedCheckbox);
    }

    private showFlashMessage(type: 'success' | 'error', message: string, time: number): void {
        this.flashMessage = type;
        this.message = message;
        this._changeDetectorRef.markForCheck();
        setTimeout(() => {
            this.flashMessage = this.message = null;
            this._changeDetectorRef.markForCheck();
        }, time);
    }
}
