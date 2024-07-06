import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private hubConnection: signalR.HubConnection;

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7216/message?userId=7ecdb57a-7430-4962-acc2-0ed2d58af52c') // URL của SignalR hub
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err));
    }

    public addMessageListener = (callback: (message: any) => void) => {
        this.hubConnection.on('ReceiveMessage', (message) => {
            callback(message);
        });
    }

    public sendMessage = (message: any) => {
        this.hubConnection.invoke('SendMessage', message)
            .catch(err => console.error(err));
    }
}
