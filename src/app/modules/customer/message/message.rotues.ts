import { Routes } from '@angular/router';
import { MessageComponent } from './message.component';
import { inject } from '@angular/core';
import { MessageService } from './message.service';

export default [
    {
        path: '',
        component: MessageComponent,
        resolve: {
            connection: () => inject(MessageService).startConnection(),
        },
    },
] as Routes;
