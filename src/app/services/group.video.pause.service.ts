import { Injectable, Output,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupVideoPauseService {

  @Output() playVideobyPostId = new EventEmitter();


  constructor() { }

  emitcurrentplayingVideoId(postId){
    this.playVideobyPostId.emit(postId);
  }

}
