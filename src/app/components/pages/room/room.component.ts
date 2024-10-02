import { Component, HostListener } from '@angular/core';
import { Room } from '../../../models/room.model';
import { RoomsService } from '../../../services/rooms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../../services/players.service';
import { faCircleQuestion, faClock, } from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrl: './room.component.scss'
})
export class RoomComponent {
    roomCode = '';
    room!: Room;
    name = '';

    players!: string[];
    isRoomOwner = false;

    iconQuestion = faCircleQuestion;
    iconTime = faClock;

    constructor(
        private readonly roomsService: RoomsService,
        private readonly playersService: PlayersService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        this.playersService.currentPlayer$.subscribe({
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
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.room = data;
                    }
                }
            });

        this.refreshPlayers()

        this.playersService.listenToPlayerAdded(this.roomCode).subscribe(() => {
            this.refreshPlayers();
        });

        this.playersService.listenToPlayerRemoved(this.roomCode).subscribe(() => {
            this.refreshPlayers();
        });
    }

    ngOnDestroy() {
        this.deleteRoom();
    }

    refreshPlayers() {
        this.playersService.getPlayersFromRoom(this.roomCode)
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.players = data;
                        this.isRoomOwner = this.players[0] === this.name;
                    }
                }
            });
    }

    startGame() {
        if (!this.isRoomOwner) {
            return;
        }
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
}
