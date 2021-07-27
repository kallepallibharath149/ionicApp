import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseURL = 'http://konnect.egatetech.com:8888/api/';
  private httpOptions: any;

  constructor(
    private http: HttpClient
  ) {
    let settings: any = {
      // "Content-Type": "application/json",
      // 'Access-Control-Allow-Origin':'*'
    };
    this.httpOptions = {
      headers: new HttpHeaders(settings)
    };
  }

  // this are used for DNM services
  httpGet(endPoint: string, meta?: any): Observable<any> {
    return this.http.get(this.baseURL + endPoint)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  httpPost(endPoint: string, body?: any, headerPresent?): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (headerPresent == true) {
      return this.http.post(this.baseURL + endPoint, JSON.stringify(body), { headers: headers })
        .pipe(
          catchError(err => this.handleError(err))
        );
    } else {
      return this.http.post(this.baseURL + endPoint, JSON.stringify(body))
        .pipe(
          catchError(err => this.handleError(err))
        );
    }
  }

  httpDelete(endPoint: string, body?: any): Observable<any> {
    if (body) {
      return this.http.request('DELETE', this.baseURL + endPoint, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: body
      }).pipe(
        catchError(err => this.handleError(err))
      );
    } else if (!body) {
      return this.http.delete(this.baseURL + endPoint)
        .pipe(
          catchError(err => this.handleError(err))
        );
    }
  }

  httpUpdate(endPoint: string, body?: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (body) {
      return this.http.put(this.baseURL + endPoint, JSON.stringify(body), { headers: headers })
        .pipe(
          catchError(err => this.handleError(err))
        );
    } else {
      return this.http.put(this.baseURL + endPoint, body)
        .pipe(
          catchError(err => this.handleError(err))
        );
    }

  }

  httpUpdateFormData(endPoint: string, body?: FormData): Observable<any> {
    let headers = new HttpHeaders();
    if (body) {
      return this.http.put(this.baseURL + endPoint, body, { headers: headers })
        .pipe(
          catchError(err => this.handleError(err))
        );
    } else {
      return this.http.put(this.baseURL + endPoint, body)
        .pipe(
          catchError(err => this.handleError(err))
        );
    }

  }

  handleError(error: any, url?: any, genericErrorMes?: any) {
    return throwError(error);
  }

  httpFormPost(endPoint: string, body?: FormData): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(this.baseURL + endPoint, body, { headers: headers })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

}
