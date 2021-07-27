import { Injectable, Output,EventEmitter } from '@angular/core';
import { HttpService } from '../../../interceptors/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPostsService {
  previewEvent: any;
  posts:Array<any> = [];
  events: Array<any> = [];
  @Output() emitNewUserPost = new EventEmitter();
  @Output() emitNeweventCreated = new EventEmitter();
  constructor( private httpClient: HttpService) {
    this.posts = [];
   }

addUserPost(blobUrl){ 
 this.posts.unshift(blobUrl);
 this.emitNewUserPost.emit(blobUrl);   
}

addEvent(eventObj){ 
  this.events.unshift(eventObj);
  this.emitNeweventCreated.emit(eventObj);
 }

 setPreviewEvent(eventObj){
   this.previewEvent = eventObj;
 }

 clearPreviewEvent(){
  this.previewEvent = null;
 }



 addCommentToPost(endPoint: any, body?): Observable<any> {
  return this.httpClient.httpFormPost(endPoint, body);
}

getPostComments(endPoint: any, body?): Observable<any> {
  return this.httpClient.httpGet(endPoint);
}

addReplyToComment(endPoint: any, body?): Observable<any> {
  return this.httpClient.httpFormPost(endPoint, body);
}

getRepliesToComments(endPoint: any, body?): Observable<any> {
  return this.httpClient.httpGet(endPoint);
}

likePost(endPoint: any, body?): Observable<any>{
  return this.httpClient.httpPost(endPoint,body, true);
}

revertLike(endPoint: any, body?): Observable<any>{
  return this.httpClient.httpDelete(endPoint, body);
}

getPostLikes(endPoint: any): Observable<any>{
  return this.httpClient.httpGet(endPoint);
}

getPostLikesSummury(endPoint: any, body?): Observable<any>{
  return this.httpClient.httpGet(endPoint);
}

}
