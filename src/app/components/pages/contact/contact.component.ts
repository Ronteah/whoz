import { Component } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    iconBack = faArrowLeft;
    iconLinkedin = faLinkedin;
    iconTwitter = faXTwitter;
    iconInstagram = faInstagram;

    constructor() { }

    backHome() {
        window.history.back();
    }
}
