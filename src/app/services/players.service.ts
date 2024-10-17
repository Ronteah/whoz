import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlayersService {
    readonly API_URL = `${environment.API_URL}/api/rooms`;
    private socket = io(environment.API_URL);

    currentPlayer$: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('currentPlayer') || '');

    constructor(private readonly httpClient: HttpClient) { }

    setCurrentPlayer(name: string) {
        this.currentPlayer$.next(name);
        localStorage.setItem('currentPlayer', name);
    }

    getCurrentPlayer() {
        return this.currentPlayer$.value;
    }

    getPlayersFromRoom(roomCode: string) {
        return this.httpClient.get(`${this.API_URL}/${roomCode}/players`);
    }

    addPlayerToRoom(player: string, roomCode: string) {
        const body = {
            player: player
        };

        return this.httpClient.post(`${this.API_URL}/${roomCode}/players/add`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    removePlayerFromRoom(player: string, roomCode: string) {
        const body = {
            player: player
        };

        return this.httpClient.post(`${this.API_URL}/${roomCode}/players/remove`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    listenToPlayerAdded(roomCode: string): Observable<string> {
        return new Observable<string>((observer) => {
            this.socket.on(`playerAddedToRoom-${roomCode}`, (player: string) => {
                observer.next(player);
            });

            return () => {
                this.socket.off(`playerAddedToRoom-${roomCode}`);
            };
        });
    }

    listenToPlayerRemoved(roomCode: string): Observable<string> {
        return new Observable<string>((observer) => {
            this.socket.on(`playerRemovedFromRoom-${roomCode}`, (player: string) => {
                observer.next(player);
            });

            return () => {
                this.socket.off(`playerRemovedFromRoom-${roomCode}`);
            };
        });
    }
}
