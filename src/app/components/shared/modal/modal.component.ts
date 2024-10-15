import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent {
    @Input() title: string = 'Êtes vous sûr ?';
    @Input() message: string = 'Confirmez-vous l\'action ?';
    @Input() confirmText: string = 'Confirmer';
    @Input() cancelText: string = 'Annuler';

    @Output() confirmEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() closeModalEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    closeModal() {
        this.closeModalEmitter.emit();
    }

    confirm() {
        this.confirmEmitter.emit();
    }
}
