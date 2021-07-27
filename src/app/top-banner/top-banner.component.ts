import { Component, OnInit, AfterViewInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { filesBaseURL, GLOBAL_SEARCH_UI_ITEMS, navItems } from './../common/global.constants';
import { HttpService } from './../interceptors/http.service';
import { EventsService } from '../services/events.service';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { GroupsService } from '../groups/groups.service';
import { members } from '../groups/groups.model';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { navigateAction } from '../common/models/profile.model';
import { GlobalNavigateService } from '../services/global.navigate.service';
//import { EventEmitter } from 'protractor';


@Component({
  selector: 'app-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.less']
})
export class TopBannerComponent implements OnInit, AfterViewInit, OnDestroy {
  eventSubscription:Subscription;
  @Output('topviewIntiation') topviewIntiation = new EventEmitter<any>();
  GLOBAL_SEARCH_UI_ITEMS:Array<any> = GLOBAL_SEARCH_UI_ITEMS;
  globalSearchPageNumber:number = 1;
  globalSearchTotalCount:number = 0;
  globalSearchprofileResults:Array<any> = [];
  noGlobalSearchprofile:boolean = false;
  showGlobalSearchLoading:boolean = false;
  globalSearchAPISubscription:Subscription;
  globalSearchFocused:boolean = false;
  baseUrl:any = filesBaseURL;
  globalSearchResultsToView: any = {
    localSearch:[],
    membersSearch:[]
  }
  @ViewChild('globalSearchInput')globalSearchInput: ElementRef;
  @ViewChild('globalSearchInput1')globalSearchInput1: ElementRef;
  hamburgerClikedState:boolean = false;
  constructor(private httpService: HttpService, private router:Router,
    private eventService:EventsService,
    private groupService: GroupsService,
    public messageService: MessageService,
    private globalNavigate:GlobalNavigateService,
    ) { 
    this.navItems = navItems;
   this.eventSubscription = this.eventService.getEvent().subscribe((resp)=>{
      if(resp.ACTION_TYPE == 'MAIN_NAVIGATION_STATE'){
        let matched: boolean = false;
        for (let i=0 ; i<this.navItems.length; i++){
          if(resp.VALUE == this.navItems[i].navLink){
            this.activeIndex = i;
            matched = true;
            break ;
          }
          if(!matched){
            this.activeIndex = null; 
          }
        }
      } else {
        this.activeIndex = null;  
      }
    });
    router.events.subscribe((val) => {
      this.hamburgerClikedState = false;
      document.querySelector('body').classList.remove("overflow-hide");
    });
  }
  
  globalSearch:string = "";
  activeIndex = 0;
  navItems: Array<any> = [];
   

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    fromEvent<any>(this.globalSearchInput.nativeElement, 'keyup').pipe(map(ev=>ev.target.value),debounceTime(1000),distinctUntilChanged(), switchMap(val=> { 
      if(this.globalSearchAPISubscription){
        this.globalSearchAPISubscription.unsubscribe();
      }
      return of(1)})).subscribe(() =>{
     this.searchGlobalSearchResults(); 
    });
    fromEvent<any>(this.globalSearchInput1.nativeElement, 'keyup').pipe(map(ev=>ev.target.value),debounceTime(1000),distinctUntilChanged(), switchMap(val=> { 
      if(this.globalSearchAPISubscription){
        this.globalSearchAPISubscription.unsubscribe();
      }
      return of(1)})).subscribe(() =>{
     this.searchGlobalSearchResults(); 
    })
    this.topviewIntiation.emit();
  }

  ngOnDestroy(){
    this.eventSubscription.unsubscribe(); 
  }

  navigateRoute(i, item) {
    this.activeIndex = i;
    if(item.navigateTo){
    this.router.navigate([item.navigateTo]);
    }
  }

  searchGlobalSearchResults(){
    if(this.globalSearch.match(/([0-9]+|[a-z]+)/gi)){
      this.getMembersToAdd(true);
      let filteredItems:Array<any> = [];
      this.GLOBAL_SEARCH_UI_ITEMS.forEach((item, index) =>{
        let keys = item.searchItem;
        for(let i=0 ; i<item.searchItem.length; i++){
           let searchTerm = item.searchItem[i].toLowerCase();
           let patt = new RegExp(searchTerm, "gi");
           if (patt.test(this.globalSearch.trim().toLowerCase())){
             let ind = filteredItems.findIndex((definedItem)=> definedItem.displayText.toLowerCase() == item.displayText.toLowerCase());
             if(ind == -1){
               filteredItems.push(item);
             } else {
               filteredItems.splice(ind, 1, item);
             } 
           }
        }
      });
      this.globalSearchResultsToView.localSearch = filteredItems;
    } else {
      this.globalSearchPageNumber = 1;
      this.globalSearchResultsToView.localSearch = []; 
      this.globalSearchResultsToView.membersSearch = [];  
    }
  }

  lazyLoadSearch(){
    if(this.globalSearchResultsToView.membersSearch < this.globalSearchTotalCount){
      this.globalSearchPageNumber = this.globalSearchPageNumber +1;
      this.getMembersToAdd(false)
    }
  }

  getMembersToAdd(initialState): void {
    let endPoint = '';
     if(initialState){
      this.globalSearchprofileResults = [];
      endPoint = `User/search?name=${this.globalSearch}&pageNumber=${this.globalSearchPageNumber}&pagesize=50`;
     } else {
      endPoint = `User/search?name=${this.globalSearch}&pageNumber=${this.globalSearchPageNumber}&pagesize=20`; 
     }
     this.showGlobalSearchLoading = true;
     this.noGlobalSearchprofile = false;
     this.globalSearchAPISubscription = this.groupService.getMembersToAdd(endPoint).subscribe((resp: any) => {
        if (resp) {
          this.globalSearchTotalCount = resp.totalCount;
          let usersList:Array<any> = [];
          resp.users.forEach(user => {
            let users = {
              profileName: user.firstName + ' ' + user.lastName,
              profileId: user.profileId,
              profileImageUrl: user.profileImageUrl,
              profileCoverImageUrl: user.profileCoverImageUrl,
              navigateTo: 'testtt/profile'
            }
            usersList.push(users);
          });
          this.globalSearchprofileResults = [...this.globalSearchprofileResults, ...usersList];
          this.globalSearchResultsToView.membersSearch = JSON.parse(JSON.stringify(this.globalSearchprofileResults))
        }
        if (this.globalSearchprofileResults.length <= 0) {
          this.noGlobalSearchprofile = true;
            // this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No members found with given search criteria' });
        } else {
          this.noGlobalSearchprofile = false;
        }
        this.noGlobalSearchprofile = false;
        this.showGlobalSearchLoading = false;
      }, error => {this.showGlobalSearchLoading = false;});
  }

  navigateToProfile(profile){
    this.router.navigate(['testtt/profile', profile.profileId]);
  }


  navigateToAppSearchResults(searchItem) {
    let navigation: navigateAction;
    if (searchItem.navigationSection == 'EVENTS') {
      if (searchItem.navigationType == 'MAIN_NAVIGATION') {
        navigation = {
          ROUTE: searchItem.navigateTo,
          NAVIGATION_TYPE: searchItem.navigationType,
          OPTIONS: searchItem.navigationOptions
        }
      } else if (searchItem.navigationType == 'SUB_NAVIGATION') {

      }

    } else if (searchItem.navigationSection == 'GROUPS') {
      if (searchItem.navigationType == 'MAIN_NAVIGATION') {
        navigation = {
          ROUTE: searchItem.navigateTo,
          NAVIGATION_TYPE: searchItem.navigationType,
          OPTIONS: searchItem.navigationOptions
        }
      } else if (searchItem.navigationType == 'SUB_NAVIGATION') {

      }

    } else if (searchItem.navigationSection == 'NETWORK') {
      if (searchItem.navigationType == 'MAIN_NAVIGATION') {
        navigation = {
          ROUTE: searchItem.navigateTo,
          NAVIGATION_TYPE: searchItem.navigationType,
          OPTIONS: searchItem.navigationOptions
        }
      } else if (searchItem.navigationType == 'SUB_NAVIGATION') {

      }

    } else if (searchItem.navigationSection == 'POSTS') {
      if (searchItem.navigationType == 'MAIN_NAVIGATION') {
        navigation = {
          ROUTE: searchItem.navigateTo,
          NAVIGATION_TYPE: searchItem.navigationType,
          OPTIONS: searchItem.navigationOptions
        }
      } else if (searchItem.navigationType == 'SUB_NAVIGATION') {

      }

    }  else if (searchItem.navigationSection == 'PROFILE') {
      if (searchItem.navigationType == 'MAIN_NAVIGATION') {
        navigation = {
          ROUTE: searchItem.navigateTo,
          NAVIGATION_TYPE: searchItem.navigationType,
          OPTIONS: searchItem.navigationOptions
        }
      } else if (searchItem.navigationType == 'SUB_NAVIGATION') {

      }

    }

    this.globalNavigate.navigateToRoute(navigation);
  }

  clearGlobalSearch(){
    this.globalSearch = '';
    this.searchGlobalSearchResults();
  }

  homburgerClicked(state){
  this.hamburgerClikedState = !this.hamburgerClikedState;
  if(this.hamburgerClikedState){
    document.querySelector('body').classList.add("overflow-hide");
  } else {
    document.querySelector('body').classList.remove("overflow-hide");  
  }
  }

}
