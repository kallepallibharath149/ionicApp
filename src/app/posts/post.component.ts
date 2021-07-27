import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { groupsListResponse } from '../groups/groups.model';
import { GroupsService } from '../groups/groups.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit, OnDestroy {

  // to hide some content in prifile page added this input. Reused this component in profile page 
  @Input('showStories') showStories: boolean = true;
  @Input('posts') posts: Array<any> = [];
  @Input('currentGroup') currentGroup: any = '';
  infiniteScrollSubscription: Subscription;
  groupEventSubscription:Subscription;
  getAllGroupsSubscription: Subscription;
  groupsListDetails: Array<groupsListResponse> = [];
  groupsListTotalCount: number = 0;
  groupsListPageNumber: number = 1;
  selectedGroup: any;
  groupsLoading: boolean = false;
  noGroups: boolean = false;

  navigatedToDefault:boolean = false;


  constructor(private eventService: EventsService,
    private groupservice: GroupsService, private router: Router) {
    this.infiniteScrollSubscription = this.eventService.listenInfiniteScrollGroupEvent().subscribe((state) => {
      if (state && state.container == 'LEFT_CONTAINER') {
        //  Calling infinite scroll event
      }
    });
  }


  lazyLoad() {
    if (this.groupsListDetails.length < this.groupsListTotalCount) {
      this.groupsListPageNumber = this.groupsListPageNumber + 1;
      this.getAllGroupDetails()
    }
  }

  groupSelected(group, myDrop, ev) {
    this.currentGroup = group;
    this.eventService.setGroupEvent(group);
    ev.stopPropagation(); 
    myDrop.close();
  }

  ngOnInit(): void {
    this.getAllGroupDetails('initial');
  }

  getAllGroupDetails(initialState?) {
    let endPoint = '';
    if (initialState) {
      this.groupsListDetails = [];
      endPoint = `group/Groups?pageNo=${this.groupsListPageNumber}&pageSize=50&adminsSize=4&membersSize=5`;
    } else {
      endPoint = `group/Groups?pageNo=${this.groupsListPageNumber}&pageSize=20&adminsSize=4&membersSize=6`;
    }
    this.groupsLoading = true;
    this.noGroups = false;
    this.groupservice.getAllGroups(endPoint).subscribe((resp) => {
      if (resp) {
        this.groupsListTotalCount = resp.totalCount;
        let groupsArray = resp.groups;
        this.groupsListDetails = [...this.groupsListDetails, ...JSON.parse(JSON.stringify(groupsArray))];
      }
      if (this.groupsListDetails.length <= 0) {
        this.noGroups = true;
      } else {
        this.noGroups = false;
      }
      this.groupsLoading = false;
      this.eventService.storeGroupsDetails(this.groupsListDetails, this.groupsListTotalCount);
      this.eventService.triggerInfiniteScrollGroupEvent({ container: 'POSTS_CONTAINER' });
      this.navigateToDefaultGroup();
    }, err => {
      this.groupsLoading = false;
    });
  }

  navigateToDefaultGroup() {
    // checking default group and navigating to default group
    if (this.groupsListDetails.length > 0 && !this.navigatedToDefault) {
      let defaultIndex = this.groupsListDetails.findIndex((item: groupsListResponse) => {
        return item?.defaultGroup;
      });
      let group: any ;
      group = this.groupsListDetails[0];
      if (defaultIndex >= 0) {
        group = this.groupsListDetails[defaultIndex];
      }
      this.navigatedToDefault = true;
      this.eventService.setGroupEvent(group);
    } else if (this.groupsListDetails.length <= 0) {
      this.router.navigate(['testtt/groupsPosts/noGroups']);
    }
  }

  ngOnDestroy() {
    this.infiniteScrollSubscription.unsubscribe();
  }

}
