import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './../interceptors/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private router: Router,
    private httpClient: HttpService) { }

  logIn(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body, true);
  }

  registerUser(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body, true);
  }

  completeRegistration(endPoint: any, body?): Observable<any>{
    return this.httpClient.httpUpdate(endPoint, body);
  }

  reGenerateRegistrastionCode(endPoint: any, body?): Observable<any>{
    return this.httpClient.httpUpdate(endPoint, body);
  }

  updatePassWord(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpUpdate(endPoint, body);
  }

  updatePasswordGenerateCode(endPoint: any, body?): Observable<any>{
    return this.httpClient.httpUpdate(endPoint, body);
  }

  forgottPasswordGenerateCode(endPoint: any, body?): Observable<any>{
    return this.httpClient.httpUpdate(endPoint, body);
  }

  ForgotPasswordUpdate(endPoint: any, body?): Observable<any>{
    return this.httpClient.httpUpdate(endPoint, body);
  }

}
