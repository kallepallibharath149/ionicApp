import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { comment } from './../../../common/models/posts.model';
import { UserPostsService } from '../../../posts/user-posts/user-post-service/user-posts-service';
import * as moment from 'moment';
import { loggedInUserDetails } from '../../../common/models/profile.model';
import { filesBaseURL } from '../../../common/global.constants';

@Component({
  selector: 'app-main-comment',
  templateUrl: './main-comment.component.html',
  styleUrls: ['./main-comment.component.less']
})
export class MainCommentComponent implements OnInit, AfterViewInit {
  replayComment: string = '';
  pageNumber: number = 1;
  showSpinner: boolean = false;
  showLoadMore: boolean = false;
  showReplies: boolean = false;
  initialRepliesCheck: boolean = false;
  noReplies: boolean = false;
  @ViewChild('replyCommentInput', { read: ElementRef, static: true }) replyCommentInput: ElementRef;
  @ViewChild('replyCommentImageInput') replyCommentImageInput: ElementRef;
  @Input('mainCommentObj') mainCommentObj: comment = null;
  @Input() commentsReplyArray: Array<comment> = [];
  @Input('commentIndex') commentIndex: number;
  @Input('loggedInUserDetails') loggedInUserDetails: loggedInUserDetails;
  @Input('currentReplyIndex') currentReplyIndex: any;
  tempReplyCommentImage: any;
  selectedCommentReplyFiles: any;
  showReplyPost: boolean = false;
  viewInitialized: boolean = false;
  @Output() replyClickedMaincomment = new EventEmitter();

  selectedImageVideoFiles: Array<File> = [];
  selectedImageVideoFilesObjectURLs: Array<any> = [];

  @Output('updateReplyCommentArray') updateReplyCommentArray = new EventEmitter();
  PostSlideConfig = { "initialSlide": 0, "slidesToShow": 1, "slidesToScroll": 1, "arrows": false, "dots": true, "centerPadding": '0px', "centerMode": true, "lazyLoad": 'ondemand' };

  constructor(private router: Router,
    public domSanitizationService: DomSanitizer,
    private cd: ChangeDetectorRef,
    private userPostsService: UserPostsService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
  }

  navigateToProfile() {
    this.router.navigate(['testtt/profile', this.loggedInUserDetails.profileId]);
  }

  newReplyCommentHandler(commentForm: NgForm) {
    let body: FormData = new FormData();
    let postData = {
      "commentid": this.mainCommentObj.id,
      "commenttext": this.replayComment
    }
    if (Array.from(this.selectedImageVideoFiles).length > 0) {
      Array.from(this.selectedImageVideoFiles).forEach(file => {
        body.append('Files', file);
      });
    }
    body.append('PostData', JSON.stringify(postData));
    if (this.replayComment && this.replayComment.length > 0 || Array.from(this.selectedImageVideoFiles).length > 0) {
      this.addNewCommentReply(body, commentForm)
    }
  }

  resetFields() {
    this.tempReplyCommentImage = null;
  }


  replyCommentPhotoUpload() {
    this.replyCommentImageInput.nativeElement.click();
    this.replyCommentInput.nativeElement.focus();
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

  handleReplyCommentPhotoUpload(event) {
    let uploadedImg;
    let imgUrl;
    if (event.target.files.length > 0) {
      uploadedImg = event.target.files[0];
      this.selectedCommentReplyFiles = uploadedImg;
      imgUrl = URL.createObjectURL(uploadedImg);
      this.tempReplyCommentImage = this.domSanitizationService.bypassSecurityTrustUrl(imgUrl);
    }
  }

  discardTempororyImg() {
    this.tempReplyCommentImage = null;
  }

  replyToComment(eventFrom?) {
    this.showReplyPost = true;
    this.showReplies = true;
    this.cd.detectChanges();
    if (eventFrom != 'showHide' || !this.noReplies) {
      this.replyClickedMaincomment.emit(this.commentIndex);
      this.replyCommentFocus();
    }
    if (!this.initialRepliesCheck) {
      this.initialRepliesCheck = true;
      this.getCommentsReply();
    }
  }

  showHideReply() {
    if (this.showReplies) {
      this.showReplies = false;
    } else {
      this.showReplies = true;
      this.replyToComment('showHide');
    }
  }


  addNewCommentReply(body: FormData, commentForm: NgForm) {
    let endPoint = `post/comment2`
    this.userPostsService.addCommentToPost(endPoint, body).subscribe(resp => {
      this.clearBlobObjects();
      commentForm.reset();
      this.getCommentsReply('latestReplied');
    });
  }

  getCommentsReply(state?) {
    let endPoint = `post/comment2?commentid=${this.mainCommentObj.id}&pageNumber=${this.pageNumber}&pageSize=10`;
    if (state == 'latestReplied') {
      endPoint = `post/comment2?commentid=${this.mainCommentObj.id}&pageNumber=1&pageSize=100`;
    }
    this.showSpinner = true;
    this.userPostsService.getRepliesToComments(endPoint).subscribe(resp => {
      this.showSpinner = false;
      if (resp && Array.isArray(resp) && resp.length > 0) {
        resp.forEach((comment: comment) => {
          comment.profileImageUrl = comment.profileImageUrl?`${filesBaseURL}${comment.profileImageUrl}`:'';
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
      if (state == 'latestReplied') {
        const results = resp.filter(({ id: id1 }) => !this.commentsReplyArray.some(({ id: id2 }) => id2 === id1));
        this.commentsReplyArray = [...results, ...this.commentsReplyArray];
      } else if (state != 'latestReplied') {
        this.commentsReplyArray = [...this.commentsReplyArray, ...resp];
      }
      if (this.commentsReplyArray.length <= 0) {
        this.noReplies = true;
      }
    });
  }

  replyCommentFocus() {
    setTimeout(() => {
      if (this.viewInitialized && this.showReplyPost) {
        this.replyCommentInput.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        this.replyCommentInput.nativeElement.focus();
      }
    }, 300);

  }

  loadMoreCommentsReplies() {
    this.pageNumber = this.pageNumber + 1;
    this.getCommentsReply();
  }

  removeSelectedUploadPost(itemIndex, resource) {
    URL.revokeObjectURL(this.selectedImageVideoFilesObjectURLs[itemIndex]['blobUrl']);
    this.selectedImageVideoFilesObjectURLs.splice(itemIndex, 1);
    let file = Array.from(this.selectedImageVideoFiles);
    file.splice(itemIndex, 1);
    this.selectedImageVideoFiles = file;
  }

  showVal() {

  }


}
