import { Injectable } from '@angular/core';
import { eventAction } from './../common/models/profile.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { groupsListResponse } from '../groups/groups.model';

@Injectable({
  providedIn: 'root'
})

export class EventsService {

  groupsListDetails: Array<groupsListResponse> = [];
  groupListTotalCount:number = 0;

  private groupEvent = new BehaviorSubject<any>('initial');
  private infiniteScrollGroupEvent = new Subject<any>();

  private event = new Subject<eventAction>();

  constructor() {

  }

  //this events are used for auto highlighting  top main navigation items ///Dont use for other event emits
  setEvent(state: eventAction) {
    this.event.next(state);
  }
  //this events are used for auto highlighting  top main navigation items ///Dont use for other event emits
  getEvent(): Observable<eventAction> {
    return this.event.asObservable();
  }

    //this events are used for setting current selected Group in posts page
    setGroupEvent(groupId) {
      this.groupEvent.next(groupId);
    }
    //this events are used for setting current selected Group in posts page
    getGroupEvent(): Observable<any> {
      return this.groupEvent.asObservable();
    }

    storeGroupsDetails(groupsListDetails, groupListTotalCount){
     this.groupsListDetails = groupsListDetails;
     this.groupListTotalCount = groupListTotalCount;
    }

    triggerInfiniteScrollGroupEvent(state){
     this.infiniteScrollGroupEvent.next(state);  
    }

    listenInfiniteScrollGroupEvent(): Observable<any> {
      return this.infiniteScrollGroupEvent.asObservable();
    }

    getStoredGroupDetails(){
      let details = {
        groups: this.groupsListDetails.length ?this.groupsListDetails: [],
        groupListTotalCount: this.groupListTotalCount?this.groupListTotalCount:0
      }

      return details;
    }

    resetGroupsDetails(){
      this.groupsListDetails = [];
      this.groupListTotalCount = 0;  
    }

}
