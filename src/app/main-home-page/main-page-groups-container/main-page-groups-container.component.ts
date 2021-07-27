import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { post } from './../../common/models/posts.model';
import { HttpService } from './../../interceptors/http.service';
import { Subscription } from 'rxjs';
import { groupPostReloadService } from './groupPost.reload';
import { EventsService } from './../../services/events.service';


@Component({
  selector: 'app-main-page-groups-container',
  templateUrl: './main-page-groups-container.component.html',
  styleUrls: ['./main-page-groups-container.component.less']
})
export class MainPageGroupsContainerComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  currentGroupId: string;
  currentGroup: any;
  latestPosts: Array<any> = [];
  pageNumber: number = 1;
  showLoader: boolean = false;
  userMessage: Array<any> = [];
  reachedEndOfPosts: boolean = false;
  groupEventSubscription:Subscription;
  constructor(private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    public domSanitizationService: DomSanitizer,
    private groupReloadService: groupPostReloadService,
    private eventService: EventsService,) { 
     this.groupEventSubscription = this.eventService.getGroupEvent().subscribe(group =>{
       if(group && group!= 'initial'){
        this.currentGroupId = group.id;
        this.currentGroup = group;
        if(this.currentGroupId){
          this.getInitialLatestPosts('initialization');
        }
        this.reachedEndOfPosts = false; 
        this.eventService.setGroupEvent('initial');
       }  
      });
    }

  ngOnInit(): void {
    this.groupReloadService.reloadGroupLatestPosts.subscribe(state => {
      if (state) {
        this.getInitialLatestPosts('reload');
      }
    });

  }

  getInitialLatestPosts(APICallState?) {
    this.userMessage = [];
    this.pageNumber = 1;
    if (APICallState == 'initialization') {
      this.latestPosts = [];
      this.reachedEndOfPosts = false;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.getLatestPosts(APICallState);
  }

  getLatestPosts(state?) {
    this.showLoader = true;
    this.subscription = this.httpService.httpGet(`Post/Posts?groupId=${this.currentGroupId}&pageNumber=${this.pageNumber}`).subscribe((response: Array<post>) => {
      setTimeout(() => {
        this.showLoader = false;
      }, 100);
      if (Array.isArray(response) && response.length > 0) {
        response.forEach(post => {
          post.postCategory = '';
          post.profileImageUrl = `http://3.230.104.70:8888/api/${post.profileImageUrl}`;
          post.resources.forEach((resourse, i) => {
            if (resourse.fileType && (resourse.fileType.toLowerCase() == 'image' || resourse.fileType.toLowerCase() == 'video' || resourse.fileType.toLowerCase() == 'other')) {
              resourse.url = `http://3.230.104.70:8888/api/${resourse.url}`;
            }
          });
          if (post.resources.length <= 0) {
            post.postTextOnly = true;
          } else {
            post.postTextOnly = false;
          }
        });
        if (state == 'reload') {
          const results = response.filter(({ id: id1 }) => !this.latestPosts.some(({ id: id2 }) => id2 === id1));
          this.latestPosts = [...results, ...this.latestPosts];
        } else {
          this.latestPosts = [...this.latestPosts, ...response];
          // for(let i=0; i<10000;i++){
          //   this.latestPosts.push(response[0]);
          // }
        }
      } else {
        if (this.latestPosts.length <= 0) {
          this.userMessage = [{ severity: 'info', summary: 'No posts. You are the first person. Please post here...', detail: '' }];
          this.reachedEndOfPosts = true;
        } else if (this.latestPosts.length > 0 && Array.isArray(response) && response.length <= 0) {
          this.userMessage = [{ severity: 'info', summary: 'End of Posts...', detail: '' }];
          this.reachedEndOfPosts = true;
        }
      }
    }, (error) => {
    });
  }

  onScroll() {
    //  if(!this.reachedEndOfPosts){
    this.pageNumber = this.pageNumber + 1;
    this.getLatestPosts();
    //  }
  }

  ngOnDestroy(){
    this.groupEventSubscription.unsubscribe();
  }

}
