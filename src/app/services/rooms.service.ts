import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Room } from '../models/room.model';
import { Result } from '../models/result.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoomsService {
    readonly API_URL = `${environment.API_URL}/api/rooms`;
    private socket = io(environment.API_URL);

    currentRoom$: BehaviorSubject<Room> = new BehaviorSubject<Room>(
        JSON.parse(localStorage.getItem('currentRoom') as string)
    );

    constructor(private readonly httpClient: HttpClient) { }

    setCurrentRoom(room: Room) {
        this.currentRoom$.next(room);
        localStorage.setItem('currentRoom', JSON.stringify(room));
    }

    getCurrentRoom() {
        return this.currentRoom$.value;
    }

    getRoomFromCode(code: string) {
        return this.httpClient.get(`${this.API_URL}/${code}`);
    }

    createRoom(numberOfQuestions: number, timeToAnswer: number, gamemodeId: any) {
        const body = {
            numberOfQuestions,
            timeToAnswer,
            gamemodeId
        };

        return this.httpClient.post(`${this.API_URL}/create`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    deleteRoom(roomCode: string) {
        return this.httpClient.delete(`${this.API_URL}/${roomCode}/delete`);
    }

    startGame(roomCode: string, owner: string) {
        const body = {
            owner
        };

        return this.httpClient.post(`${this.API_URL}/${roomCode}/start`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    answerQuestion(roomCode: string, answer: string) {
        const body = {
            answer
        };

        return this.httpClient.post(`${this.API_URL}/${roomCode}/answer`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    listenToGameStarted(roomCode: string): Observable<string> {
        return new Observable<string>((observer) => {
            this.socket.on(`gameStarted-${roomCode}`, () => {
                observer.next();
            });

            return () => {
                this.socket.off(`gameStarted-${roomCode}`);
            };
        });
    }

    listenToNextQuestion(roomCode: string): Observable<string> {
        return new Observable<string>((observer) => {
            this.socket.on(`nextQuestion-${roomCode}`, (question: string) => {
                observer.next(question);
            });

            return () => {
                this.socket.off(`nextQuestion-${roomCode}`);
            };
        });
    }

    listenToGameOver(roomCode: string): Observable<string> {
        return new Observable<string>((observer) => {
            this.socket.on(`gameOver-${roomCode}`, () => {
                observer.next('');
            });

            return () => {
                this.socket.off(`gameOver-${roomCode}`);
            };
        });
    }

    nextResult(roomCode: string) {
        return this.httpClient.get(`${this.API_URL}/${roomCode}/results/next`);
    }

    previousResult(roomCode: string) {
        return this.httpClient.get(`${this.API_URL}/${roomCode}/results/previous`);
    }

    listenToNextResult(roomCode: string): Observable<Result> {
        return new Observable<Result>((observer) => {
            this.socket.on(`nextResult-${roomCode}`, (result: Result) => {
                observer.next(result);
            });

            return () => {
                this.socket.off(`nextResult-${roomCode}`);
            };
        });
    }

    listenToPreviousResult(roomCode: string): Observable<Result> {
        return new Observable<Result>((observer) => {
            this.socket.on(`previousResult-${roomCode}`, (result: Result) => {
                observer.next(result);
            });

            return () => {
                this.socket.off(`previousResult-${roomCode}`);
            };
        });
    }
}
