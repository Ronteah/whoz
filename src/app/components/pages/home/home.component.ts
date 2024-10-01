import { RoomsService } from './../../../services/rooms.service';
import { Component, } from '@angular/core';
import { faRightToBracket, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { GamemodesService } from '../../../services/gamemodes.service';
import { Gamemode } from '../../../models/gamemode.model';
import { PlayersService } from '../../../services/players.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    iconCreate = faSquarePlus;
    iconJoin = faRightToBracket;

    isCreation = true;

    name = '';
    numberOfQuestions = 10;
    timeToAnswer = 30;
    roomCode = '';

    gamemodes: Gamemode[] = [];
    selectedGamemode: any = undefined;

    canCreateRoom = false;
    canJoinRoom = false;

    constructor(
        private readonly gamemodesService: GamemodesService,
        private readonly roomsService: RoomsService,
        private readonly playersService: PlayersService
    ) { }

    ngOnInit() {
        this.gamemodesService.getGamemodes()
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.gamemodes = data;
                    }
                }
            });
    }

    toggleIsCreation() {
        this.isCreation = !this.isCreation;
    }

    onNumberOfQuestionsChange(event: any) {
        this.numberOfQuestions = event.target.value;
    }

    onTimeToAnswerChange(event: any) {
        this.timeToAnswer = event.target.value;
    }

    selectGamemode(gamemodeId: any) {
        this.selectedGamemode = gamemodeId;
        this.updateCanCreateRoom();
    }

    onNameChange(event: any) {
        this.name = event.target.value;
        this.updateCanCreateRoom();
        this.updateCanJoinRoom();
    }

    onRoomCodeChange(event: any) {
        this.roomCode = event.target.value;
        this.updateCanJoinRoom();
    }

    updateCanCreateRoom() {
        this.canCreateRoom = !!this.name && !!this.selectedGamemode;
    }

    updateCanJoinRoom() {
        this.canJoinRoom = !!this.name && this.roomCode.length === 6;
    }

    createRoom() {
        if (!this.canCreateRoom) {
            return;
        }
        this.roomsService.createRoom(this.numberOfQuestions, this.timeToAnswer, this.selectedGamemode)
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.playersService.addPlayerToRoom(this.name, data.roomCode)
                            .subscribe({
                                next: (response) => {
                                    console.log('Player added successfully:', response);
                                },
                                error: (error) => {
                                    console.error('Error adding player:', error);
                                }
                            });
                    }
                }
            });
    }

    joinRoom() {
        if (!this.canJoinRoom) {
            return;
        }
        this.playersService.addPlayerToRoom(this.name, this.roomCode);
    }
}

