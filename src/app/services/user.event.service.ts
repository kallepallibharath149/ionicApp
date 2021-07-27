import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../interceptors/http.service';

@Injectable({
  providedIn: 'root'
})

export class UserEventsService {

  constructor(private httpClient: HttpService) { }

  createEvent(endPoint: any, body: FormData): Observable<any> {
    return this.httpClient.httpFormPost(endPoint, body);
  }

  getEventType(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  deleteEvent(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpDelete(endPoint, body);
  }

  updateEvent(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpUpdateFormData(endPoint, body);
  }

  inviteUsersToPrivateEvent(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body, true);
  }

  getInvitedMembersList(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  deleteInviteeFromMyEvents(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpDelete(endPoint, body);
  }

  addCoHostToPrivateEvents(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body);
  }

  deleteCoHostToPrivateEvents(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpDelete(endPoint, body);
  }

  getMyEventsInvitations(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  getMyRejectedEvents(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  respondToEventInvitation(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpUpdate(endPoint);
  }

  getEvents(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  getEventDetails(endPoint: any): Observable<any> {
    return this.httpClient.httpGet(endPoint);
  }

  addGroupMember(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpPost(endPoint, body, true);
  }

  deleteGroupAdmin(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpDelete(endPoint, body);
  }

  approveRejectMyInvitations(endPoint: any, body?): Observable<any> {
    return this.httpClient.httpUpdate(endPoint);
  }

}
