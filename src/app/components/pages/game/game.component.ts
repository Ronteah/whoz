import { Component } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Room } from '../../../models/room.model';
import { RoomsService } from '../../../services/rooms.service';
import { PlayersService } from '../../../services/players.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseRoomComponent } from '../../shared/base-room/base-room.component';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss'
})
export class GameComponent extends BaseRoomComponent {
    selectedPlayer = '';
    twoColumns = false;
    answered = false;
    currentQuestion = '';
    currentQuestionIndex = 1;
    questionsAdvance = '';
    isGameOver = false;

    iconLeave = faClose;

    countdown!: number;
    progressCountdown = 100;
    stride = 0;

    constructor(
        protected override readonly roomsService: RoomsService,
        protected override readonly playersService: PlayersService,
        protected override readonly route: ActivatedRoute,
        protected override readonly router: Router
    ) {
        super(roomsService, playersService, route, router);
    }

    ngOnInit() {
        this.roomsService.currentRoom$
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (room: Room) => {
                    if (!!room) {
                        this.room = room;
                        this.roomCode = room.code;
                        this.countdown = room.time;
                        this.stride = 100 / room.time;
                        this.currentQuestion = room.questions[0].text;
                        this.questionsAdvance = `${this.currentQuestionIndex}/${this.room.questions.length}`;
                    }
                },
                error: () => this.router.navigate(['/'])
            });

        this.playersService.getPlayersFromRoom(this.room.code)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.players = data;

                        if (this.players.length > 5) {
                            this.twoColumns = true;
                        }
                    }
                },
                error: () => this.router.navigate(['/'])
            });

        this.roomsService.listenToNextQuestion(this.room.code)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data) => {
                    if (!!data) {
                        this.currentQuestion = data;
                        this.answered = false;
                        this.resetCoutdown();
                    }
                }
            });

        this.roomsService.listenToGameOver(this.room.code)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: () => {
                    this.isGameOver = true;

                    this.router.navigate(['/room', this.room.code, 'results']);
                }
            });

        setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
                this.progressCountdown -= this.stride;
            }
        }, 1000);
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        if (this.room?.owner === this.name && !this.isGameOver) {
            this.deleteRoom();
        }
    }

    selectPlayer(player: string) {
        this.selectedPlayer = player;
    }

    sendAnswer() {
        this.answered = true;
        this.roomsService.answerQuestion(this.room.code, this.selectedPlayer)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: () => { }
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
