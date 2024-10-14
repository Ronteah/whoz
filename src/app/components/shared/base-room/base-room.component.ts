import { Component } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { PlayersService } from '../../../services/players.service';
import { RoomsService } from '../../../services/rooms.service';
import { Room } from '../../../models/room.model';

@Component({
    selector: 'app-base-room',
    templateUrl: './base-room.component.html',
    styleUrl: './base-room.component.scss'
})
export class BaseRoomComponent extends BaseComponent {

    name = '';
    roomCode = '';

    room!: Room;
    players = [];

    constructor(
        protected readonly roomsService: RoomsService,
        protected readonly playersService: PlayersService,
        protected readonly route: ActivatedRoute,
        protected readonly router: Router
    ) {
        super();

        this.playersService.currentPlayer$
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (name: string) => {
                    if (!!name) {
                        this.name = name;
                    } else {
                        this.router.navigate(['/']);
                    }
                },
                error: () => this.router.navigate(['/'])
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
                },
                error: () => this.router.navigate(['/'])
            });
    }

    deleteRoom() {
        this.roomsService.deleteRoom(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: () => this.router.navigate(['/'])
            });
    }
}
