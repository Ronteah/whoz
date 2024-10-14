import { Room } from './../../../models/room.model';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../../services/players.service';
import { RoomsService } from '../../../services/rooms.service';
import { takeUntil } from 'rxjs';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Result } from '../../../models/result.model';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseRoomComponent } from '../../shared/base-room/base-room.component';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrl: './results.component.scss'
})
export class ResultsComponent extends BaseRoomComponent {
    currentResult!: Result;
    currentResultIndex = 1;
    resultsAdvance = '';

    question = '';
    answers: { player: string, count: number }[] = [];

    isRoomOwner = false;
    iconLeave = faClose;

    constructor(
        protected override readonly roomsService: RoomsService,
        protected override readonly playersService: PlayersService,
        protected override readonly route: ActivatedRoute,
        protected override readonly router: Router
    ) {
        super(roomsService, playersService, route, router);
    }

    ngOnInit() {
        this.roomCode = this.route.snapshot.paramMap.get('code') ?? '';

        this.roomsService.getRoomFromCode(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data: any) => {
                    if (!!data) {
                        this.room = data;
                        this.isRoomOwner = this.room.owner === this.name;
                        this.resultsAdvance = `${this.currentResultIndex}/${this.room.questions.length}`;
                        this.currentResult = this.room.results[0];
                        this.processAnswers();
                    } else {
                        this.router.navigate(['/']);
                    }
                },
                error: () => this.router.navigate(['/'])
            });

        this.roomsService.listenToNextResult(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data) => {
                    if (!!data) {
                        this.currentResult = data;
                        this.currentResultIndex++;
                        this.resultsAdvance = `${this.currentResultIndex}/${this.room.questions.length}`;
                    } else {
                        if (this.room.owner === this.name) {
                            this.leaveRoom();
                        } else {
                            this.router.navigate(['/']);
                        }
                    }
                }
            });

        this.roomsService.listenToPreviousResult(this.roomCode)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
                next: (data) => {
                    if (!!data) {
                        this.currentResult = data;
                        this.currentResultIndex--;
                        this.resultsAdvance = `${this.currentResultIndex}/${this.room.questions.length}`;
                    } else {
                        if (this.room.owner === this.name) {
                            this.leaveRoom();
                        } else {
                            this.router.navigate(['/']);
                        }
                    }
                }
            });
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        if (this.room?.owner === this.name) {
            this.deleteRoom();
        }
    }

    nextResult() {
        this.roomsService.nextResult(this.roomCode);
    }

    previousResult() {
        this.roomsService.previousResult(this.roomCode);
    }

    private processAnswers() {
        this.question = this.currentResult.question;

        this.answers = Object.entries(this.currentResult.answers).map(([player, count]) => ({
            player,
            count: Number(count)
        }));

        this.createChart();
    }

    private createChart() {
        Chart.register(ChartDataLabels);

        let chart = new Chart('chart', {
            type: 'doughnut',
            data: {
                labels: this.answers.map(a => a.player),
                datasets: [{
                    data: this.answers.map(a => a.count),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6633', '#FF33FF', '#33FF33', '#3333FF'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            color: '#FAFAFA',
                            font: {
                                weight: 'normal',
                                size: 18,
                            },
                            padding: 24
                        }
                    },
                    tooltip: {
                        enabled: false,
                    },
                    datalabels: {
                        color: '#FAFAFA',
                        font: {
                            weight: 'normal',
                            size: 14,
                        },
                        formatter: (value: any, context: any) => {
                            const label = `${context.chart.data.labels[context.dataIndex]} : ${context.chart.data.datasets[0].data[context.dataIndex]}`;
                            return label;
                        },
                        anchor: 'center',
                        align: 'center',
                        backgroundColor: '#0F1029',
                        borderRadius: 4,
                        padding: {
                            top: 4,
                            bottom: 4,
                            left: 8,
                            right: 8,
                        }
                    }
                }
            }
        });
    }

}
