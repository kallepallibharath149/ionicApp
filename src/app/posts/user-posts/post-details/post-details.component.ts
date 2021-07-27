import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { UserPostsService } from '../user-post-service/user-posts-service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { GlobalEmittingEventsService } from '../../../services/global-emitting-events.service';
import { comment, post } from '../../../common/models/posts.model';
import { GroupVideoPauseService } from '../../../services/group.video.pause.service';
import { Subscription } from 'rxjs';
import { IprofileDetails } from '../../../common/models/profile.model';
declare var $;
import Viewer from 'viewerjs';
import {DialogService} from 'primeng/dynamicdialog';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.less']
})
export class PostDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  focusInput: boolean = false;
  postComment: string = '';
  replyPostComment: string = '';
  likeStatus: boolean = false;
  showComments: boolean = false;
  commentsExpanded: boolean = false;
  showCommentsSection: boolean = false;
  commentsArray: Array<comment> = [];
  postLikesProfiles: Array<IprofileDetails> = [];
  videoPlaySubscription: Subscription;
  @ViewChild('postVideoRef', { static: false }) postVideoRef: ElementRef;
  @ViewChild('friendsPannel', { static: false }) friendsPannel;
  @Input('postDetails') postDetails: post;
  @Input('postIndex') postIndex: any;
  @Input('userDetails') userDetails: any;
  @Input('lastItem') lastItem: any;
  @Input('currentGroupId')currentGroupId: any ='';
  photoOverlayViewer:any;
  loggedInUserDetails:any;
  authDetailsSubscription:Subscription;
  loggedInUserId: string = "ed27ac86-2aa8-4341-9b92-1b162b0420d7";

  likesPageNumber: number = 1;
  showLikesPanelLoader: boolean = false;
  currentLikesEndReached: boolean = false;
  showLoadMoreLikes: boolean = false;
  initialLikesPannelAPITriggred: boolean = false;

  PostSlideConfig = {
    "lazyLoad": 'ondemand',
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "centerPadding": '0px',
    "centerMode": true,
    "edgeFriction": 0.3,
    "touchThreshold": 10
  };

  constructor(private route: Router,
    public domSanitizationService: DomSanitizer,
    private userPostsService: UserPostsService,
    public messageService: MessageService,
    private globalEmitterService: GlobalEmittingEventsService,
    private groupVideoPauseService: GroupVideoPauseService,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService) {
      this.authDetailsSubscription = this.authService.authDetails.subscribe(authData =>{
        if(authData != 'initial'){
         this.loggedInUserDetails = this.authService.getUserDetails();
        }
     });
     }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.videoPlaySubscription = this.groupVideoPauseService.playVideobyPostId.subscribe(postId => {
      if (postId != this.postDetails.id) {
        if ((<HTMLVideoElement>(this.postVideoRef.nativeElement)).currentTime > 0) {
          (<HTMLVideoElement>(this.postVideoRef.nativeElement)).load();
        }
      }
    });
    this.likeStatus = this.postDetails.postLikedByMe;
    if (this.postDetails.resources && this.postDetails.resources.length <= 1) {
      this.PostSlideConfig.dots = false;
    }
    // this.getPostLikes();
    // let obj: any = {};
    // obj['fileType'] = 'pdf';
    // obj['url'] = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
    // this.postDetails.resources.push(obj);
  }
  navigateToProfile(profileName, profileid) {
    this.globalEmitterService.setCurrentProfileObj(profileName);
    this.route.navigate(['testtt/profile', profileid]);
  }

  ngAfterViewInit() {
    // if(this.postDetails.postVideos.length>0){
    //   (<HTMLVideoElement>(this.postVideoRef.nativeElement)).addEventListener('play', (event) => {
    //     this.groupVideoPauseService.emitcurrentplayingVideoId(this.postDetails.id);
    //   });
    // }
    // let className = `.slick${this.postIndex}`;
    // $(className).slick();
  }

  ngOnDestroy() {
    this.videoPlaySubscription.unsubscribe();
    this.authDetailsSubscription.unsubscribe();
    if(this.photoOverlayViewer){
      this.photoOverlayViewer.destroy();
    }
  }

  updateLikeStatus() {
    let body = {
      "postid": this.postDetails.id,
      "groupid": this.postDetails.groupid,
      "profileid":  this.loggedInUserDetails.profileId
    }
    if (!this.likeStatus) {
      let endPoint = `post/like`;
      this.userPostsService.likePost(endPoint, body).subscribe(resp => {
        this.likeStatus = true;
        this.postDetails.postLikesCount = +this.postDetails.postLikesCount + 1;
        this.getPostLikes('latest');
      });
    } else if (this.likeStatus) {
      let endPoint = `post/like`;
      this.userPostsService.revertLike(endPoint, body).subscribe(resp => {
        this.likeStatus = false;
        this.postDetails.postLikesCount = +this.postDetails.postLikesCount - 1;
        let index = this.postLikesProfiles.findIndex(profile => {
          return profile.profileId == this.loggedInUserDetails.profileId;
        });
        if (index >= 0) {
          this.postLikesProfiles.splice(index, 1);
        }
      });
    }

    // this.likeStatus = ! this.likeStatus;

    // if(this.likeStatus){
    //   this.postLikesProfiles.push(likedProfileObj)
    // } else {
    //  let index = this.postLikesProfiles.findIndex(likeObj=>{
    //     return likeObj.profileName == 'raju';
    //   });
    //   this.postLikesProfiles.splice(index,1);
    // }

  }

  commentFocus() {
    //  this.getPostComments();
    this.commentsExpanded = !this.commentsExpanded;
    this.showComments = true;
    setTimeout(() => {
      this.focusInput = !this.focusInput;
    }, 300);
  }

  getPostLikes(state?) {
    let endPoint = `post/${this.postDetails.id}/likes?groupid=${this.postDetails.groupid}&pageNumber=${this.likesPageNumber}&pageSize=10`;
    if (state == 'latest') {
      endPoint = `post/${this.postDetails.id}/likes?groupid=${this.postDetails.groupid}&pageNumber=1&pageSize=100`;
    }
    this.showLikesPanelLoader = true;
    this.userPostsService.getPostLikes(endPoint).subscribe((resp: Array<IprofileDetails>) => {
      this.showLikesPanelLoader = false;
      if (resp && Array.isArray(resp) && resp.length > 0) {
        resp.forEach(profile => {
          if (profile.profileId == this.loggedInUserDetails.profileId) {
            this.likeStatus = true;
          }
        });
        if (state && state == 'latest') {
          const results = resp.filter(({ profileId: profileId1 }) => !this.postLikesProfiles.some(({ profileId: profileId2 }) => profileId2 == profileId1));
          this.postLikesProfiles = [...this.postLikesProfiles, ...results];
        } else {
          if (this.likesPageNumber == 1) {
            this.postLikesProfiles = [];
          }
          this.postLikesProfiles = [...this.postLikesProfiles, ...resp];
          if (resp.length == 10) {
            this.currentLikesEndReached = false;
            this.showLoadMoreLikes = true;
          } else if (resp.length < 10) {
            this.currentLikesEndReached = true;
            this.showLoadMoreLikes = false;
          }
          // this.likesPageNumber = this.likesPageNumber+1;
          // this.getPostLikes();
        }
      } else if (resp && Array.isArray(resp) && resp.length == 0) {

      }
    }, (error) => {
      this.showLikesPanelLoader = false;
    });
  }

  sharePost(postDetails: any) {
    let obj = Object.assign({}, postDetails);
    obj.postCategory = 'share';
    obj.postedUserName = 'Siva Ramu'
    // this.userPostsService.addUserPost(obj);
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'shared to your timeline' })
  }
  resetVideo() {
    // if(this.postDetails.postVideos.length>0){
    //    this.postVideoRef.nativeElement.load();
    // }
  }

  showLikesFriendsSummury(event) {
    event.stopPropagation();
    if(this.postDetails.postLikesCount){
      this.friendsPannel.toggle(event);
      if (!this.initialLikesPannelAPITriggred) {
        this.getPostLikes();
      }
      this.initialLikesPannelAPITriggred = true
    }
  }

  loadMoreLikes() {
    this.likesPageNumber = this.likesPageNumber + 1;
    this.getPostLikes();
  }

  imagePreview(resourceIndex) {
    let that = this;
    this.photoOverlayViewer = new Viewer(document.getElementById(`images${this.postIndex}`), {
      inline: false,
      fullscreen: true,
      title: false,
      initialViewIndex: resourceIndex,
      shown() {
      },
      hidden() {
        that.photoOverlayViewer.destroy();
      }
    });
    this.photoOverlayViewer.show();
  }

  showVal(last) {
    alert(last);
  }

}
