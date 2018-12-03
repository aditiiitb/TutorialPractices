import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  public submitFeedback(feedback: Feedback | any): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type" : "application/json"
      })
    };
    return this.http.post<Feedback>(
      baseURL+ "feedback",
      feedback,
      httpOptions
    )
  }
}
