import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';

export default [
    {
        path: '',
        component: ProfileComponent,
        resolve: {
            user: () => inject(AuthService).signInUsingToken(),
        },
    },
] as Routes;
