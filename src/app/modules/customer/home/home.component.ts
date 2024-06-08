import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { CheckboxListComponent } from 'app/modules/custom-components/checkbox-list/checkbox-list.box.component';

@Component({
    selector: 'home',
    standalone: true,
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatCheckboxModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatIconModule, MatInputModule, CheckboxListComponent, FuseCardComponent, RouterModule]
})
export class HomeComponent implements OnInit {

    isLoading: boolean = false;
    search: string;
    filterForm: UntypedFormGroup;

    categories = [
        { id: 1, name: 'Sữa cho mẹ' },
        { id: 2, name: 'Sữa cho bé' },
        { id: 3, name: 'Từ 1 đến 3' },
        { id: 4, name: 'Từ 3 đến 5 tuổi' },
        { id: 5, name: 'Từ 5 đến 8 tuổi' },
        { id: 6, name: 'Trên 8 tuổi' },
        { id: 7, name: 'Trên 12 tuổi' }
    ];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
    ) { }

    ngOnInit(): void {
        this.initFilterForm();
    }

    private initFilterForm() {
        this.filterForm = this._formBuilder.group({
            search: [null],
            categories: [null]
        });
    }

    onCategoriesChanged(selectedCheckbox: string[]) {
        this.filterForm.controls['categories'].setValue(selectedCheckbox);

        this.filterForm.value.categories
            .map((checked, index) => checked ? this.categories[index].name : null)
            .filter(value => value !== null);

        console.log(this.filterForm.value);

    }
}
