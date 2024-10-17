import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question } from '../models/question.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  questions$: BehaviorSubject<Question> = new BehaviorSubject<Question>({} as Question);

  readonly API_URL = `${environment.API_URL}/api/questions`;

  constructor(private readonly httpClient: HttpClient) { }

  getQuestions() {
    this.httpClient.get(this.API_URL)
      .subscribe({
        next: (data: any) => {
          if (!!data) {
            this.questions$.next(data);
          }
        }
      });
  }

  addQuestion(question: string) {
    let formData = new FormData();
    formData.append('question', question);
    this.httpClient.post(`${this.API_URL}/add`, formData)
      .subscribe(() => {
        this.getQuestions();
      });
  }

  deleteQuestion(id: string) {
    this.httpClient.delete(`${this.API_URL}/delete`, {
      params: { id }
    })
      .subscribe(() => {
        this.getQuestions();
      });
  }
}
