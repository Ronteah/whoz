import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GamemodesService {
    readonly apiUrl = 'http://localhost:3000/api/gamemodes';

    constructor(private readonly httpClient: HttpClient) { }

    getGamemodes() {
        return this.httpClient.get(this.apiUrl);
    }
}
