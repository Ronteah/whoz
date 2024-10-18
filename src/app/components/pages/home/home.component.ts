import { RoomsService } from './../../../services/rooms.service';
import { Component, } from '@angular/core';
import { faRightToBracket, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { GamemodesService } from '../../../services/gamemodes.service';
import { Gamemode } from '../../../models/gamemode.model';
import { PlayersService } from '../../../services/players.service';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared/base/base.component';
import { takeUntil } from 'rxjs';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent {
    iconCreate = faSquarePlus;
    iconJoin = faRightToBracket;
    iconLinkedin = faLinkedin;
    iconTwitter = faXTwitter;
    iconInstagram = faInstagram;

    isCreation = true;
    isServerDown = false;
    isLoading = true;

    name = '';
    numberOfQuestions = 10;
    timeToAnswer = 30;
    roomCode = '';

    gamemodes: Gamemode[] = [];
    selectedGamemode: any = undefined;

    canCreateRoom = false;
    canJoinRoom = false;

    errorMessage!: string;

    constructor(
        private readonly gamemodesService: GamemodesService,
        private readonly roomsService: RoomsService,
        private readonly playersService: PlayersService,
        private readonly router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.gamemodesService.getGamemodes()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.gamemodes = data;
                        this.isLoading = false;
                    }
                },
                error: () => {
                    this.gamemodes = [];
                    this.isServerDown = true;
                    this.isLoading = false;
                }
            });

        this.playersService.setCurrentPlayer('');
        this.roomsService.setCurrentRoom(null as any);
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
        this.canJoinRoom = !!this.name && this.roomCode.length === 5;
    }

    createRoom() {
        if (!this.canCreateRoom) {
            return;
        }
        this.roomsService.createRoom(this.numberOfQuestions, this.timeToAnswer, this.selectedGamemode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.playersService.addPlayerToRoom(this.name, data.roomCode)
                            .pipe(takeUntil(this.ngUnsubscribe$))
                            .subscribe({
                                next: () => {
                                    this.playersService.setCurrentPlayer(this.name);
                                    this.router.navigate([`/room/${data.roomCode}`]);
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
        this.playersService.addPlayerToRoom(this.name, this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: () => {
                    this.playersService.setCurrentPlayer(this.name);
                    this.router.navigate([`/room/${this.roomCode}`]);
                },
                error: () => {
                    this.errorMessage = 'La salle est introuvable ou ce nom est déjà pris.';
                }
            });
    }
}

