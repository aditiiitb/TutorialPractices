import { Injectable } from "@angular/core";
import { Leader } from "../shared/leader";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";
import { map, catchError } from "rxjs/operators";
import { ProcessHTTPMsgServiceService } from "./process-httpmsg-service.service";

@Injectable({
  providedIn: "root"
})
export class LeaderService {
  constructor(
    private http: HttpClient,
    private processHTTPMsg: ProcessHTTPMsgServiceService
  ) {}

  getLeaders(): Observable<Leader[]> {
    return this.http
      .get<Leader[]>(baseURL + "leadership")
      .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getLeader(id: number): Observable<Leader> {
    return this.http
      .get<Leader>(baseURL + "leadership/" + id)
      .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http
      .get<Leader>(baseURL + "leadership?featured=true")
      .pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsg.handleError));
  }
}
