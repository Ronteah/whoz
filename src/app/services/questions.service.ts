import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  questions$: BehaviorSubject<Question> = new BehaviorSubject<Question>({} as Question);

  readonly apiUrl = 'http://localhost:3000/api/questions';

  constructor(private readonly httpClient: HttpClient) { }

  getQuestions() {
    this.httpClient.get(this.apiUrl)
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
    this.httpClient.post(`${this.apiUrl}/add`, formData)
      .subscribe(() => {
        this.getQuestions();
      });
  }

  deleteQuestion(id: string) {
    this.httpClient.delete(`${this.apiUrl}/delete`, {
      params: { id }
    })
      .subscribe(() => {
        this.getQuestions();
      });
  }
}
