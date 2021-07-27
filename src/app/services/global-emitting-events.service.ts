import { Injectable, Output,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalEmittingEventsService {
  heightObj :any;
  @Output() navigationEventEmitter = new EventEmitter();
  @Output() currentTopNavHeightObj = new EventEmitter();
  curentProfileObj: any = null;
  loggedInUserDetails: any = null;
  loggedInDetailsEmit = new BehaviorSubject<any>(false);
  scrollingEvent = new BehaviorSubject<any>(false);

  constructor() { }

  emitcurrentTopNavHeightObj(heightObj){
    this.heightObj = heightObj;
    this.currentTopNavHeightObj.emit(heightObj);
  }

  emitScrollingEvent(event){
   this.scrollingEvent.next(event);
  }

  setCurrentProfileObj(profileobj){
    this.curentProfileObj = profileobj;
  }

  getCurrentProfileObj():any{
    return this.curentProfileObj
  }


}
