import { Injectable, Output,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class groupPostReloadService {

  @Output() reloadGroupLatestPosts = new EventEmitter();

  constructor() { }


  reloadGroupPost(reloadState){
    this.reloadGroupLatestPosts.emit(reloadState);
  }

}
