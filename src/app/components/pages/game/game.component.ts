import { Component } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Room } from '../../../models/room.model';
import { RoomsService } from '../../../services/rooms.service';
import { PlayersService } from '../../../services/players.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss'
})
export class GameComponent {
    players = [];
    selectedPlayer = '';
    twoColumns = false;
    answered = false;
    room!: Room;
    roomCode = '';
    currentQuestion = '';
    currentQuestionIndex = 1;
    questionsAdvance = '';

    iconLeave = faClose;

    countdown!: number;
    progressCountdown = 100;
    stride = 0;

    name = '';

    constructor(
        private readonly roomsService: RoomsService,
        private readonly playersService: PlayersService,
        private readonly router: Router
    ) { }

    ngOnInit() {
        this.roomsService.currentRoom$.subscribe({
            next: (room: Room) => {
                if (!!room) {
                    this.room = room;
                    this.roomCode = room.code;
                    this.countdown = room.time;
                    this.stride = 100 / room.time;
                    this.currentQuestion = room.questions[0].text;
                    this.questionsAdvance = `${this.currentQuestionIndex}/${this.room.questions.length}`;
                }
            }
        });

        this.playersService.currentPlayer$.subscribe({
            next: (name: string) => {
                if (!!name) {
                    this.name = name;
                }
            }
        });

        this.playersService.getPlayersFromRoom(this.room.code)
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.players = data;

                        if (this.players.length > 5) {
                            this.twoColumns = true;
                        }
                    }
                }
            });

        this.roomsService.listenToNextQuestion(this.room.code)
            .subscribe({
                next: (data) => {
                    if (!!data) {
                        this.currentQuestion = data;
                        this.answered = false;
                        this.resetCoutdown();
                    } else {
                        if (this.room.owner === this.name) {
                            this.leaveRoom();
                        } else {
                            this.router.navigate(['/']);
                        }
                    }
                }
            });

        setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
                this.progressCountdown -= this.stride;
            }
        }, 1000);
    }

    ngOnDestroy() {
        if (this.room.owner === this.name) {
            this.deleteRoom();
        }
    }

    selectPlayer(player: string) {
        this.selectedPlayer = player;
    }

    sendAnswer() {
        this.answered = true;
        this.roomsService.answerQuestion(this.room.code, this.selectedPlayer)
            .subscribe({
                next: () => { }
            });
    }

    leaveRoom() {
        this.playersService.removePlayerFromRoom(this.name, this.roomCode)
            .subscribe({
                next: (data: any) => {
                    if (data?.numberOfPlayersLeft === 0) {
                        this.deleteRoom();
                    } else {
                        this.router.navigate(['/']);
                    }
                }
            });
    }

    private deleteRoom() {
        this.roomsService.deleteRoom(this.roomCode)
            .subscribe({
                next: () => {
                    this.router.navigate(['/']);
                }
            });
    }

    private resetCoutdown() {
        this.countdown = this.room.time;
        this.progressCountdown = 100;
        this.selectedPlayer = '';
        this.currentQuestionIndex++;
        this.questionsAdvance = `${this.currentQuestionIndex}/${this.room.questions.length}`;
    }
}
