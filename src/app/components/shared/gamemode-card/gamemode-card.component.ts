import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gamemode } from '../../../models/gamemode.model';

@Component({
    selector: 'app-gamemode-card',
    templateUrl: './gamemode-card.component.html',
    styleUrl: './gamemode-card.component.scss'
})
export class GamemodeCardComponent {
    @Input() gamemode!: Gamemode;
    @Input() selectedId: any;
    @Output() emitSelectedGamemode: EventEmitter<any> = new EventEmitter<any>();

    isSelected = false;

    constructor() { }

    ngOnChanges() {
        this.isSelected = this.selectedId === this.gamemode._id;
    }

    selectGamemode() {
        this.emitSelectedGamemode.emit(this.gamemode._id);
    }
}
