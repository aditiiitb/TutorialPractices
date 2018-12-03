import { Injectable } from "@angular/core";
import { Promotion } from "../shared/promotion";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";
import { map, catchError } from "rxjs/operators";
import { ProcessHTTPMsgServiceService } from "./process-httpmsg-service.service";

@Injectable({
  providedIn: "root"
})
export class PromotionService {
  constructor(
    private http: HttpClient,
    private processHTTPMsg: ProcessHTTPMsgServiceService
  ) {}

  getPromotions(): Observable<Promotion[]> {
    return this.http
      .get<Promotion[]>(baseURL + "promotions")
      .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http
      .get<Promotion>(baseURL + "promotions/" + id)
      .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http
      .get<Promotion[]>(baseURL + "promotions?featured=true")
      .pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHTTPMsg.handleError));
  }
}
