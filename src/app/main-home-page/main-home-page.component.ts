import { Component, OnInit, HostBinding, HostListener, ViewChild, ElementRef, Renderer2, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GlobalEmittingEventsService } from '../services/global-emitting-events.service';
import { HttpService } from './../interceptors/http.service';
import { groups, groupsListResponse } from './../groups/groups.model';
import { Router } from '@angular/router';
import { GroupsService } from './../groups/groups.service';
import { EventsService } from './../services/events.service';
import { eventAction } from './../common/models/profile.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-home-page',
  templateUrl: './main-home-page.component.html',
  styleUrls: ['./main-home-page.component.less']
})
export class MainHomePageComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {
  @ViewChild('leftSideContainer', { read: ElementRef, static: false }) leftSideContainer: ElementRef<HTMLElement>;
  @ViewChild('sideGroup2', { read: ElementRef, static: false }) sideGroup2: ElementRef<HTMLElement>;
  @ViewChild('sideGroup', { read: ElementRef, static: false }) sideGroup: ElementRef<HTMLElement>;
  @ViewChild('rightSideContainer', { read: ElementRef, static: false }) rightSideContainer: ElementRef<HTMLElement>;
  groups: Array<any> = [];
  element: ElementRef;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    this.globalEmitterService.emitScrollingEvent($event);
  }
  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.setLeftRightcontainerStyles();
  }

  navigatedToDefault: boolean = false;
  groupsListDetails: Array<groupsListResponse> = [];
  groupsListTotalCount:number = 0;
  selectedGroup: any;
  infiniteScrollSubscription:Subscription;
  groupEventSubscription:Subscription;

  public setLeftRightcontainerStyles() {
    let topBannerHeight = 0;
    if (document.getElementById('topBanner')) {
      topBannerHeight = document.getElementById('topBanner').clientHeight + 2;
    }
    let finalHeight = window.innerHeight - topBannerHeight;
    this.renderer.setStyle(this.sideGroup.nativeElement, 'height', finalHeight + 'px');
    this.renderer.setStyle(this.sideGroup2.nativeElement, 'height', finalHeight + 'px');
    this.renderer.setStyle(this.leftSideContainer.nativeElement, 'height', finalHeight + 'px');
    this.renderer.setStyle(this.leftSideContainer.nativeElement, 'top', topBannerHeight + 'px');
    this.renderer.setStyle(this.rightSideContainer.nativeElement, 'height', finalHeight + 'px');
    this.renderer.setStyle(this.rightSideContainer.nativeElement, 'top', topBannerHeight + 'px');
  }
  constructor(private _elementRef: ElementRef,
    private renderer: Renderer2,
    private globalEmitterService: GlobalEmittingEventsService,
    private httpService: HttpService,
    private router: Router,
    private groupservice: GroupsService,
    private eventService:EventsService,
    ) {
    this.element = this._elementRef.nativeElement;
    this.infiniteScrollSubscription =  this.eventService.listenInfiniteScrollGroupEvent().subscribe((state)=>{
      if(state && state.container =='POSTS_CONTAINER'){
        let groupDetails = this.eventService.getStoredGroupDetails();
        if(groupDetails.groups.length > 0){
          this.groupsListDetails = groupDetails.groups;
          this.groupsListTotalCount = groupDetails.groupListTotalCount;
        } else {
          // this.getAllGroupDetails();
        } 
      }
    });
    this.groupEventSubscription = this.eventService.getGroupEvent().subscribe(group =>{
      if(group && group!= 'initial'){
       this.selectedGroup = group;
      }  
     });
  }

  ngOnInit(): void {
    let action:eventAction = {
    ACTION_TYPE :'MAIN_NAVIGATION_STATE',
     VALUE:'Posts'
    }
    this.eventService.setEvent(action);
  }

  ngAfterViewInit() {
    this.setLeftRightcontainerStyles();
  }

  ngAfterContentInit() {
    //this.setLeftRightcontainerStyles();
  }

    ngOnDestroy(){
        this.eventService.resetGroupsDetails();
        this.infiniteScrollSubscription.unsubscribe();
    }

    lazyloadGroups(){
      this.eventService.triggerInfiniteScrollGroupEvent({container: 'LEFT_CONTAINER'}); 
    }

}
