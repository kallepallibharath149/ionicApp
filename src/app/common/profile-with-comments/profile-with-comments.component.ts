import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-with-comments',
  templateUrl: './profile-with-comments.component.html',
  styleUrls: ['./profile-with-comments.component.less']
})
export class ProfileWithCommentsComponent implements OnInit {
  
  @Input('userDetails') userDetails : any;
  @Input('likeStatus') likeStatus : any;
  @Input('commentsArray') commentsArray : Array<any> = [] ;
  @Input('likesArray') likesArray : Array<any> = [];
  showComments: boolean = false;
  focusInput: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  updateCommentArray(updatedArray, addedcommentObj){
     this.showComments = true;
     this.commentsArray.push(addedcommentObj);
    }

    updateCommentArrayForReply(updatedObj, addedreplyPostObj,index){
       let repliedObj = this.commentsArray[index];
       repliedObj.commentReplayArray.push(addedreplyPostObj);
       this.commentsArray.splice(index,1,repliedObj);
     }

     sharePost(postDetails){

     }

     commentFocus(){
      this.showComments = true;
      this.focusInput = !this.focusInput;
      }

      updateLikeStatus(){

      }

}
