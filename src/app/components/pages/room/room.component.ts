import { Component, HostListener } from '@angular/core';
import { Room } from '../../../models/room.model';
import { RoomsService } from '../../../services/rooms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../../services/players.service';
import { faCircleQuestion, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from '../../shared/base/base.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrl: './room.component.scss'
})
export class RoomComponent extends BaseComponent {
    roomCode = '';
    room!: Room;
    name = '';

    players!: string[];
    isRoomOwner = false;
    canStart = false;
    starting = false;
    copied = false;

    iconQuestion = faCircleQuestion;
    iconTime = faClock;
    iconCopy = faCopy;
    iconCheck = faCheck;

    constructor(
        private readonly roomsService: RoomsService,
        private readonly playersService: PlayersService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        super();

        this.playersService.currentPlayer$
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (name: string) => {
                    if (!!name) {
                        this.name = name;
                    }
                }
            });
    }

    ngOnInit() {
        this.roomCode = this.route.snapshot.paramMap.get('code') ?? '';

        this.roomsService.getRoomFromCode(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.room = data;
                        this.roomsService.setCurrentRoom(this.room);
                    }
                }
            });

        this.refreshPlayers()

        this.playersService.listenToPlayerAdded(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {
                this.refreshPlayers();
            });

        this.playersService.listenToPlayerRemoved(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {
                this.refreshPlayers();
            });

        this.roomsService.listenToGameStarted(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {
                this.router.navigate([`room/${this.roomCode}/game`]);
            });
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        if (!this.starting && this.isRoomOwner) {
            this.deleteRoom();
        }
    }

    refreshPlayers() {
        this.playersService.getPlayersFromRoom(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.players = data;
                        this.isRoomOwner = this.players[0] === this.name;
                        this.canStart = this.players.length > 1 && this.isRoomOwner;
                    }
                }
            });
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.roomCode);
        this.copied = true;
    }

    startGame() {
        if (!this.isRoomOwner) {
            return;
        }

        this.starting = true;

        this.roomsService.startGame(this.roomCode, this.name)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: () => { }
            });
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
}
