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

        setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
                this.progressCountdown -= this.stride;
            }
        }, 1000);
    }

    selectPlayer(player: string) {
        this.selectedPlayer = player;
    }

    sendAnswer() {
        this.answered = true;
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
