import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserPostsService } from '../../posts/user-posts/user-post-service/user-posts-service';
import { filesBaseURL } from '../global.constants';
import { comment, post } from '../models/posts.model';
import { loggedInUserDetails } from '../models/profile.model';


@Component({
  selector: 'app-comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.less']
})
export class CommentsContainerComponent implements OnInit, AfterViewInit {
  initialComentsCheck: boolean = false;
  showSpinner: boolean = false;
  pageNumber: number = 1;
  showLoadMore: boolean = false;
  viewInitialized: boolean = false;
  postComment: string = '';
  replyPostComment: string = '';
  @Input() commentsArray: Array<comment> = [];
  @Input('postDetails') postDetails: post;
  _showComments: boolean = false;
  showCommentsContainer: boolean = true;
  @Input('loggedInUserDetails') loggedInUserDetails: loggedInUserDetails;
  @Input('userDetails') userDetails: any;/// need to remove in future

  @Input('commentsExpanded') set commentsExpanded(commentsExpanded: boolean) {
    if (commentsExpanded && !this.initialComentsCheck) {
      this.initialComentsCheck = true;
      this.getPostComments();
    }
  }

  @Input('showComments') set showComments(showComments: boolean) {
    if (showComments) {
      this._showComments = true;
      this.showCommentsContainer = true;
    } else {
      if (this.viewInitialized) {
        this._showComments = false;
        this.showCommentsContainer = false;
        // this.currentReplyIndex = null;
      }
    }
  };
  @Input('focusInput') set focusInput(focusInput: any) {
    this.currentReplyIndex = null;
    this._showComments = true;
    this.showCommentsContainer = true;
    this.commentFocus();
  };
  @ViewChild('commentInput') commentInput: ElementRef;
  @ViewChild('commentImageInput') commentImageInput: ElementRef;

  selectedImageVideoFiles: Array<File> = [];
  selectedImageVideoFilesObjectURLs: Array<any> = [];

  @Output() updateCommentArray = <any>new EventEmitter();
  @Output() updateCommentArrayForReply = <any>new EventEmitter();
  selectedCommentFiles: any;
  currentReplyIndex: number;

  PostSlideConfig = { "initialSlide": 0, "slidesToShow": 1, "arrows": false, "slidesToScroll": 1, "dots": true, "centerPadding": '0px', "centerMode": true, "lazyLoad": 'ondemand' };
  constructor(public domSanitizationService: DomSanitizer,
    private router: Router,
    private userPostsService: UserPostsService,) { }

  ngOnInit(): void {
    // this.getPostComments();
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
  }
  commentFocus() {
    if (this.viewInitialized) {
      this.commentInput.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      //  this.commentInput.nativeElement.focus();
    }
  }

  newCommentHandler(commentForm: NgForm) {
    let body: FormData = new FormData();
    let postData = {
      "postid": this.postDetails.id,
      "groupid": this.postDetails.groupid,
      "commenttext": this.postComment ? this.postComment: '' 
    }
    if ( Array.from(this.selectedImageVideoFiles).length > 0) {
      Array.from(this.selectedImageVideoFiles).forEach(file => {
        body.append('Files', file);
      });
    }
      body.append('PostData', JSON.stringify(postData));
    if (this.postComment && this.postComment.length > 0 ||  Array.from(this.selectedImageVideoFiles).length > 0) {
      this.updateComments(body, commentForm )
    }
  }

  handleFiles(event) {
    this.selectedImageVideoFilesObjectURLs = [];
    this.selectedImageVideoFiles = [];
    this.selectedImageVideoFiles = [...event.target.files];
    Array.from(this.selectedImageVideoFiles).forEach(file => {
      let fileObj: any = {};
      let url = URL.createObjectURL(file);
      let imageIndex = file.type.indexOf('image');
      let videoIndex = file.type.indexOf('video');
      let pdfIndex = file.type.indexOf('pdf');
      if (imageIndex >= 0) {
        fileObj['fileType'] = 'image';
        // URL.revokeObjectURL(imgObj['url']); 
      }
      if (videoIndex >= 0) {
        fileObj['fileType'] = 'video';
      }
      if (pdfIndex >= 0) {
        fileObj['fileType'] = 'pdf';
      }
      if (pdfIndex >= 0) {
        fileObj['url'] = url;
      } else {
        fileObj['url'] = this.domSanitizationService.bypassSecurityTrustUrl(url);
      }
      fileObj['blobUrl'] = url;
      this.selectedImageVideoFilesObjectURLs.push(fileObj);
    });
  }

  clearBlobObjects() {
    this.selectedImageVideoFilesObjectURLs.forEach(selectedFile => {
      URL.revokeObjectURL(selectedFile['blobUrl']);
    });
    this.selectedImageVideoFilesObjectURLs = [];
    let file = Array.from(this.selectedImageVideoFiles);
    file.splice(0, file.length);
    this.selectedImageVideoFiles = file;
  }


  commentPhotoUpload() {
    this.commentImageInput.nativeElement.click();
    this.commentInput.nativeElement.focus();
  }

  navigateToProfile() {
    this.router.navigate(['testtt/profile', this.loggedInUserDetails.profileId]);
  }

  getPostComments(state?) {
    let endPoint = `post/comments?postID=${this.postDetails.id}&pageNumber=${this.pageNumber}&pageSize=10`;
    if (state == 'latestComments') {
      endPoint = `post/comments?postID=${this.postDetails.id}&pageNumber=1&pageSize=100`;
    }
    this.showSpinner = true;
    this.userPostsService.getPostComments(endPoint).subscribe(resp => {
      this.showSpinner = false;
      if (resp && Array.isArray(resp) && resp.length > 0) {
        resp.forEach((comment: comment) => {
          comment.profileImageUrl =  comment.profileImageUrl?`${filesBaseURL}${comment.profileImageUrl}`:'';
          comment.resources.forEach((resourse, i) => {
            if (resourse.fileType && resourse.fileType.toLowerCase() == 'image') {
              resourse.url = `${filesBaseURL}${resourse.url}`;
            }
          });
          if (comment.resources.length <= 0) {
            comment.commentTextOnly = true;
          } else {
            comment.commentTextOnly = false;
          }
        });
        this.showLoadMore = true;
      } else if (resp && Array.isArray(resp) && resp.length == 0) {
        this.showLoadMore = false;
      }

      if (state == 'latestComments') {
        const results = resp.filter(({ id: id1 }) => !this.commentsArray.some(({ id: id2 }) => id2 === id1));
        this.commentsArray = [...results, ...this.commentsArray];
      } else if (state != 'latestComments') {
        this.commentsArray = [...this.commentsArray, ...resp];
      }
    });
  }

  updateComments(body:FormData,  commentForm:NgForm) {
    let endPoint = `post/comment`
    this.userPostsService.addCommentToPost(endPoint, body).subscribe(resp => {
      this.clearBlobObjects();
      commentForm.reset();
      this.getPostComments('latestComments');
    });
  }

  loadMoreComments() {
    this.pageNumber = this.pageNumber + 1;
    this.getPostComments();
  }

  removeSelectedUploadPost(itemIndex, resource) {
    URL.revokeObjectURL(this.selectedImageVideoFilesObjectURLs[itemIndex]['blobUrl']);
    this.selectedImageVideoFilesObjectURLs.splice(itemIndex, 1);
    let file = Array.from(this.selectedImageVideoFiles);
    file.splice(itemIndex, 1);
    this.selectedImageVideoFiles = file;
  }

}
