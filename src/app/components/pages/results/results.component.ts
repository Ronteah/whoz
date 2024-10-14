import { Room } from './../../../models/room.model';
import { Component } from '@angular/core';
import { BaseComponent } from '../../shared/base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../../services/players.service';
import { RoomsService } from '../../../services/rooms.service';
import { takeUntil } from 'rxjs';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Result } from '../../../models/result.model';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrl: './results.component.scss'
})
export class ResultsComponent extends BaseComponent {
    roomCode = '';
    currentResult!: Result;
    currentResultIndex = 1;
    resultsAdvance = '';
    room!: Room;

    question = '';
    answers: { player: string, count: number }[] = [];

    name = '';
    isRoomOwner = false;
    iconLeave = faClose;

    constructor(
        private readonly roomsService: RoomsService,
        private readonly playersService: PlayersService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.roomCode = this.route.snapshot.paramMap.get('code') ?? '';

        this.roomsService.getRoomFromCode(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.room = data;
                        this.isRoomOwner = this.room.owner === this.name;
                        this.resultsAdvance = `${this.currentResultIndex}/${this.room.questions.length}`;
                        this.currentResult = this.room.results[0];
                        this.processAnswers();
                    } else {
                        this.router.navigate(['/']);
                    }
                },
                error: () => this.router.navigate(['/'])
            });

        this.playersService.currentPlayer$
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (name: string) => {
                    if (!!name) {
                        this.name = name;
                    }
                }
            });

        this.roomsService.listenToNextResult(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data) => {
                    if (!!data) {
                        this.currentResult = data;
                        this.currentResultIndex++;
                        this.resultsAdvance = `${this.currentResultIndex}/${this.room.questions.length}`;
                    } else {
                        if (this.room.owner === this.name) {
                            this.leaveRoom();
                        } else {
                            this.router.navigate(['/']);
                        }
                    }
                }
            });

        this.roomsService.listenToPreviousResult(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data) => {
                    if (!!data) {
                        this.currentResult = data;
                        this.currentResultIndex--;
                        this.resultsAdvance = `${this.currentResultIndex}/${this.room.questions.length}`;
                    } else {
                        if (this.room.owner === this.name) {
                            this.leaveRoom();
                        } else {
                            this.router.navigate(['/']);
                        }
                    }
                }
            });
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        if (this.room?.owner === this.name) {
            this.deleteRoom();
        }
    }

    nextResult() {
        this.roomsService.nextResult(this.roomCode);
    }

    previousResult() {
        this.roomsService.previousResult(this.roomCode);
    }

    leaveRoom() {
        this.playersService.removePlayerFromRoom(this.name, this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
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
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: () => {
                    this.router.navigate(['/']);
                }
            });
    }

    private processAnswers() {
        this.question = this.currentResult.question;

        this.answers = Object.entries(this.currentResult.answers).map(([player, count]) => ({
            player,
            count: Number(count)
        }));
    }

}
