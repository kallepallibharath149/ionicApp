import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsService } from '../groups/groups.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { loggedInUserDetails } from '../common/models/profile.model';
import { filesBaseURL } from '../common/global.constants';
import { HttpService } from '../interceptors/http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    onlineState = new Subject<any>();
    currentOnlineState:any = '';
    authDetails = new BehaviorSubject<any>('initial');
    authDetailsObj:any;
    constructor(private router:Router,
      private httpClient: HttpService,
       private groupsService:GroupsService) {

     }

    setAuthDetails(authDetails) {
      localStorage.setItem("authDetails", JSON.stringify(authDetails));
      this.authDetailsObj = authDetails;
      this.authDetails.next(this.authDetailsObj);  
    }

    logOutUser(){
    localStorage.clear(); 

    this.router.navigate(['login']);  
    }

    getAuthDetails():any{
      return this.authDetailsObj;
    }

    getLoggedInUserProfileId(){
     return this.authDetailsObj?this.authDetailsObj.user.profileId:'';
    }

    getUserDetails():any{
      let details:loggedInUserDetails = this.authDetailsObj.user?JSON.parse(JSON.stringify(this.authDetailsObj.user)):'';
      if(this.authDetailsObj.user){
        details.profileImageUrl = details.profileImageUrl?`${filesBaseURL}${details.profileImageUrl}`:'';
        details.profileCoverImageUrl = details.profileCoverImageUrl?`${filesBaseURL}${details.profileCoverImageUrl}`:'';
      }
      return details;
    }

    emitOnlineState(state){
      this.currentOnlineState = state;
      this.onlineState.next({currentState:state});
    }

    getCurrentOnlineState():any{
     return this.currentOnlineState;
    }

    reloadUserDetails(endPoint): Observable<any> {
      return new Observable(observer => {
        this.httpClient.httpGet(endPoint).subscribe(data => {
          let authDetails = JSON.parse(localStorage.getItem("authDetails"));
          authDetails.user = data;
          localStorage.setItem("authDetails", JSON.stringify(authDetails));
          this.authDetailsObj = authDetails;
          this.authDetails.next(this.authDetailsObj); 
          observer.next(data);
          observer.complete();
        }, error =>{
          observer.error(error);
          observer.complete();
        });
      });
    }

    getuserDetailsByProfileID(profileId:string, endPoint): Observable<any> {
      let endURL = `${endPoint}/${profileId}`;
      return this.httpClient.httpGet(endURL);
    }

    updateUserDetails(endPoint: any, body: FormData): Observable<any> {
      return this.httpClient.httpUpdateFormData(endPoint, body);
    }

    getNotifications(endPoint:any): Observable<any> {
      return this.httpClient.httpGet(endPoint);
    }

}
