import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../interceptors/http.service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  groupPreviewObj: any = null;
  constructor(
    private httpClient: HttpService
  ) { }


  setGroupPreviewObject(eventObj) {
    this.groupPreviewObj = eventObj;
  }

  clearGroupPreviewObject() {
    this.groupPreviewObj = null;
  }

  getGroupDetails(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  getAllGroups(endPoint: any): Observable<any> {
    return new Observable(observer => {
      this.httpClient.httpGet(endPoint).subscribe(data => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  getGroupsCreatedByme(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  addGroupAdmin(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body, true);
  }

  addGroupMember(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body, true);
  }

  removeGroupMember(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpDelete(endPoint, body);
  }

  deleteGroupAdmin(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpDelete(endPoint, body);
  }

  createGroup(endPoint: any, body: FormData): Observable<any> {
    return this.httpClient.httpFormPost(endPoint, body);
  }

  deleteGroup(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpDelete(endPoint);
  }

  updateGroupDetails(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpUpdateFormData(endPoint, body);
  }

  addPost(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body);
  }

  getMembersToAdd(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  postToGroup(endPoint: any, body: FormData): Observable<any> {
    return this.httpClient.httpFormPost(endPoint, body);
  }

  inviteToGroup(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body, true);
  }

  getGroupInvitations(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  getMyGroupInvitations(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  approveRejectMyInvitations(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpUpdate(endPoint);
  }

  approveRejectInvitations(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpUpdate(endPoint, body );
  }

  getGroupMembers(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

}