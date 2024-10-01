import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RoomsService {
    readonly apiUrl = 'http://localhost:3000/api/rooms';

    constructor(private readonly httpClient: HttpClient) { }

    getRoomByCode(code: string) {
        return this.httpClient.get(`${this.apiUrl}/${code}`);
    }

    createRoom(numberOfQuestions: number, timeToAnswer: number, gamemodeId: any) {
        const body = {
            numberOfQuestions,
            timeToAnswer,
            gamemodeId
        };

        return this.httpClient.post(`${this.apiUrl}/create`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    deleteRoom(code: string) {
        return this.httpClient.delete(`${this.apiUrl}/delete`, {
            params: { code }
        });
    }
}
