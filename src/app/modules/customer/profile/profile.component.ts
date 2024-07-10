import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom/custom-pipes.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Observable } from 'rxjs';

@Component({
    selector: 'profile',
    standalone: true,
    templateUrl: 'profile.component.html',
    imports: [CommonModule, MatIconModule, FuseCardComponent, RouterModule, MatButtonModule, CustomPipesModule,
        MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, FuseAlertComponent]
})

export class ProfileComponent implements OnInit {

    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    user$: Observable<User>;
    profileForm: UntypedFormGroup;
    isLoading: boolean = false;

    constructor(
        private _userService: UserService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this._userService.user$.subscribe(user => {
            this.initProfileForm(user);
        });
    }

    initProfileForm(user: User) {
        this.profileForm = this._formBuilder.group({
            username: [{ value: user.username, disabled: true }, [Validators.required]],
            name: [user.name, [Validators.required]],
            phone: [user.phone, [Validators.required, Validators.pattern('^(03|05|07|08|09)[0-9]{8}$')]],
            address: [user.address, [Validators.required]],
        });
    }

    updateUser() {
        if (this.profileForm.valid) {
            this._fuseConfirmationService.open({
                title: 'Update user information',
                icon: {
                    color: 'info'
                }
            }).afterClosed().subscribe(result => {
                if (result === 'confirmed') {
                    this._userService.update(this.profileForm.value).subscribe(() => {
                        this.showFlashMessage('success', 'Update information successfull', 1500);
                    });
                }
            })
        }
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