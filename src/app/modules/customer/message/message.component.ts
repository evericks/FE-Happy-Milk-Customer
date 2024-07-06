import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';

@Component({
    selector: 'message',
    standalone: true,
    templateUrl: 'message.component.html'
})

export class MessageComponent implements OnInit {
    constructor(
        private _messageService: MessageService
    ) { }

    ngOnInit() {
        this._messageService.addMessageListener(message => {
            console.log(message.message);
        });

        // let message = {
        //     senderId: '7ecdb57a-7430-4962-acc2-0ed2d58af52c',
        //     receiverId: '7ecdb57a-7430-4962-acc2-0ed2d58af52c',
        //     message: 'Tao nè',
        // };
        // setInterval(() => {
        //     this._messageService.sendMessage(message);
        // }, 3000)
    }
}