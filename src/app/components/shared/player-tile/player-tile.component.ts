import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-player-tile',
    templateUrl: './player-tile.component.html',
    styleUrl: './player-tile.component.scss'
})
export class PlayerTileComponent {
    @Input() name!: string;
    @Input() currentPlayer!: string;
    @Input() selected = false;
    @Input() bigger = false;

    isCurrentPlayer = false;

    constructor() { }

    ngOnChanges() {
        this.isCurrentPlayer = this.name === this.currentPlayer;
    }
}
