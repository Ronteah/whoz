import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PlayersService {
    readonly apiUrl = 'http://localhost:3000/api/rooms';

    constructor(private readonly httpClient: HttpClient) { }

    getPlayers(roomCode: string) {
        return this.httpClient.get(`${this.apiUrl}/${roomCode}/players`);
    }

    addPlayerToRoom(player: string, roomCode: string) {
        const body = {
            player: player
        };

        return this.httpClient.post(`${this.apiUrl}/${roomCode}/players/add`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    removePlayerFromRoom(player: string, roomCode: string) {
        const body = {
            player: player
        };

        return this.httpClient.post(`${this.apiUrl}/${roomCode}/players/remove`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
