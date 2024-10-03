import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent {
    ngUnsubscribe$: Subject<void> = new Subject<void>();

    constructor() { }

    ngOnDestroy() {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
