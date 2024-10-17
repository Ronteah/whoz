import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GamemodesService {
    readonly API_URL = `${environment.API_URL}/api/gamemodes`;

    constructor(private readonly httpClient: HttpClient) { }

    getGamemodes() {
        return this.httpClient.get(this.API_URL);
    }
}
