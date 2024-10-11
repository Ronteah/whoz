import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Room } from '../models/room.model';
import { Result } from '../models/result.model';

@Injectable({
    providedIn: 'root'
})
export class RoomsService {
    readonly apiUrl = 'http://localhost:3000/api/rooms';
    private socket = io('http://localhost:3000');

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

    deleteRoom(roomCode: string) {
        return this.httpClient.delete(`${this.apiUrl}/${roomCode}/delete`);
    }

    startGame(roomCode: string, owner: string) {
        const body = {
            owner
        };

        return this.httpClient.post(`${this.apiUrl}/${roomCode}/start`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    answerQuestion(roomCode: string, answer: string) {
        const body = {
            answer
        };

        return this.httpClient.post(`${this.apiUrl}/${roomCode}/answer`, body, {
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

    nextQuestion(roomCode: string) {
        return this.httpClient.get(`${this.apiUrl}/${roomCode}/next`)
            .subscribe({
                next: () => { }
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
        return this.httpClient.get(`${this.apiUrl}/${roomCode}/results/next`)
            .subscribe({
                next: () => { }
            });
    }

    previousResult(roomCode: string) {
        return this.httpClient.get(`${this.apiUrl}/${roomCode}/results/previous`)
            .subscribe({
                next: () => { }
            });
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
