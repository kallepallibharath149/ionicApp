import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserEventsService } from './../../services/user.event.service';
import { GlobalNavigateService } from './../../services/global.navigate.service';
import { GroupsService } from './../../groups/groups.service';
import { filesBaseURL } from './../../common/global.constants';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionsService } from './../../services/connections.service';
import { Group } from 'ng2-dragula';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.less']
})
export class EventsListComponent implements OnInit, OnDestroy , AfterViewInit{
  authDetailsSubscription: Subscription;
  loggedInUserDetails: any;
  filesBaseURL: string = '';
  modalReference: any = '';
  navigationSubscription: Subscription;
  notificationSubscription: Subscription;
  showCreateEventBar: boolean = false;
  eventEditMode: boolean = false;
  eventEditModeImageRemoved:string = '';
  selecteEventImageUrl: any = "";
  selecteEventImage: File;
  Bloburl: any;
  @ViewChild('deleteEventConfirm') deleteEventConfirm;
  @ViewChild('myConnectionsModal') myConnectionsModal;
  @ViewChild('eventInfo') eventInfo;

  todayDate:Date = new Date();

  topTabs: Array<any> = [
    {
      label: 'Created by me'
    },
    {
      label: 'Upcoming'
    },
    {
      label: 'Pending'
    },
    {
      label: 'Rejected'
    }
  ];
  activeIndex = 0;
  activeTopTabIndex: number = null;
  selectedGroupId: any = null;
  noEvents: boolean = false;
  constMenuItems: Array<any> = [{
    name: 'All'
  },
  {
    name: 'Personal Events'
  }];
  groupsListDetails: Array<any> = [];

  groupsList: Array<any> = [];
  groupsTotalCount: number = 0;
  groupsPageNumber: number = 1;
  currentGroup: any;
  groupsLoading: boolean = false;
  noGroups: boolean = false;

  eventsList: Array<any> = [];
  eventsListTotalCount: number = 0;
  eventsListPageNumber:number = 1;

  pendingEventsList: Array<any> = [];
  pendingEventsListTotalCount: number = 0;
  pendingEventsListPageNumber:number = 1;

  rejectedEventsList: Array<any> = [];
  rejectedEventsListTotalCount: number = 0;
  rejectedEventsListPageNumber:number = 1;

  totalGroupsCount: number;
  showEventsLoading: boolean = false;
  contentLoadItems: Array<any> = [1, 2, 3];

  //myConnections Variables
  myConnectionSearchTerm: any = '';
  myConnectionsTotalCount: number = 0;
  myConnectionsPageNumber: number = 1;
  myConnectionsSearchTotalCount = 0;
  myConnectionsSearchPageNumber: number = 1;
  myConnections: Array<any> = [];
  myConnectionsMasterData: Array<any> = [];
  InvitationComments: string = '';
  searchTermResults: boolean = false;
  noConnections: boolean = false;
  showConnectionsLoad: boolean = false;

  memberActionItems: Array<any> = [
    {
      label: 'Invite to Event'
    }
  ];
  loadingItems: Array<any> = [1, 2, 3, 4];

  actionItems: Array<any> = [
    {
      "label": 'Event Members',
      "show": false,
      "showTo": ["Host", "Cohost"]
    },
    {
      "label": 'Delete Event',
      "show": false,
      "showTo": ["Host"]
    },
    {
      "label": 'Invite Members',
      "show": false,
      "showTo": ["Host", "Co-host"]
    },
    {
      "label": 'Edit Event',
      "show": false,
      "showTo": ["Host"]
    }
  ];

  statusDropDownOptions: Array<any> = [
    {
      label: 'Accept',
      value: 'Accepted'
    },
    {
      label: 'Tentative',
      value: 'Tentative'
    },
    {
      label: 'Reject',
      value: 'Rejected'
    }
  ]

  //current actions Event details
  currentActionEventIndex: number = null;
  currentActionEventObj: any = null;
  currentSelectedGoup: any;

  eventTypes: Array<any> = [];
  newEvent: any = {
    "EventTypeId": "",

    "Name": "",

    "For": "",

    "Description": "",

    "isListPublic": false,

    "StartDatetime": null,

    "EndDatetime": null,

    "Location": "",

    "Street1": "",

    "Street2": "",

    "City": "",

    "State": "",

    "ZipPin": "",

    "RsvpByDate": null

  }


  getEventsSubscription: Subscription;

  constructor(private sanitizer: DomSanitizer,
    private globalNavigateService: GlobalNavigateService,
    public messageService: MessageService,
    private userEvents: UserEventsService,
    private groupsService: GroupsService,
    private modalService: NgbModal,
    private connectionsService: ConnectionsService,
    private authService: AuthService,
    private confirmationService: ConfirmationService) {
    this.filesBaseURL = filesBaseURL;
    this.navigationSubscription = this.globalNavigateService.globalNavigationEvent.subscribe(action => {
      if (action && action != null) {
        if (action.NAVIGATION_PAGE == 'EVENTS') {
          if (action.SHOW_SIDEBAR) {
            this.showCreateEventBar = true;
          }
        }
      }
    });
    this.authDetailsSubscription = this.authService.authDetails.subscribe(authData => {
      if (authData != 'initial') {
        this.loggedInUserDetails = this.authService.getUserDetails();
      }
    });
  }

  ngOnInit(): void {
    // this.getEventDetails();
    this.getEventTypes();
    this.getAllGroupDetails(true);
    setTimeout(()=>{
      this.navigateGroup(this.activeIndex, '', true);
    }, 500);
  }

  ngAfterViewInit(){
    this.navigationSubscription = this.globalNavigateService.globalNavigationEvent.subscribe(action =>{
      if(action && action !=null){
        if (action.NAVIGATION_PAGE == 'EVENTS') {
          if (action.SHOW_SIDEBAR) {
            this.showCreateEventBar = true;
          }
          if(action.ACTIVE_TAB_INDEX >=0){
            this.activeTopTabIndex = action.ACTIVE_TAB_INDEX;
            this.navigateGroup(this.activeIndex, '', true);
          } else {
            this.navigateGroup(this.activeIndex, '', true);  
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
    this.authDetailsSubscription.unsubscribe();
  }

  navigateGroup(index, group?, initial?) {
    if (this.activeIndex == index && !initial) {
      return;
    }
    this.currentSelectedGoup = null;
    this.activeIndex = index;
    this.selectedGroupId = group && group.id ? group.id : null;
    this.currentSelectedGoup = group && group.id ? group : null;
    if (this.activeTopTabIndex == 2) {
      this.getMyEventsInvitations(true);
    } else if (this.activeTopTabIndex == 3) {
      this.getMyRejectedEvents(true);
    } else if (this.activeTopTabIndex == 0 || this.activeTopTabIndex == 1 || !this.activeTopTabIndex) {
      if (this.activeIndex == 0 || this.activeIndex == 1) {
        this.getEvents(true);
      } else {
        this.currentSelectedGoup = group;
        this.getEvents(true);
      }
    }
  }

  activateTopTab(i, label) {
    if (this.activeTopTabIndex == i) {
      this.activeTopTabIndex = null;
      this.navigateGroup(this.activeIndex, this.currentSelectedGoup, true);
      return;
    }
    this.activeTopTabIndex = i;
    this.navigateGroup(this.activeIndex, this.currentSelectedGoup, true);
    // if(label =='Pending'){

    // } else {
    //   this.getEvents(); 
    // }
  }

  menuAction(actionItem, index, actionLabel, groupOptionsRef, eventIndex, eventObj) {
    this.currentActionEventIndex = eventIndex;
    this.currentActionEventObj = eventObj;
    this.eventEditMode = false;
    if (actionLabel == 'Delete Event') {
      this.open(this.deleteEventConfirm);
    } else if (actionLabel == 'Invite Members') {
      this.open(this.myConnectionsModal, actionLabel);
      if (this.myConnectionsMasterData.length <= 0) {
        this.getMyconnections(true);
      } else {
        this.myConnections = [...this.myConnectionsMasterData];
      }
    } else if (actionLabel == 'Event Members') {
      this.open(this.eventInfo, actionLabel);
    } else if (actionLabel == 'Edit Event') {
      this.showCreateEventBar = true;
      this.eventEditMode = true;
      this.setEditEventData();
    }


    //code to hide menu action panel
    if (groupOptionsRef) {
      setTimeout(() => {
        groupOptionsRef.hide();
      }, 10);
    }
  }

  getEventTypes() {
    let endPoint = `Event/EventTypes`;
    this.userEvents.getEventType(endPoint).subscribe(resp => {
      if (resp) {
        this.eventTypes = resp;
        this.eventTypes.push({
          "id": 1,
          "description": "Other"
        });
      }
    })
  }

  getGroupsList() {
    let endPoint = `group/Groups?pageNo=1&pageSize=50&adminsSize=4&membersSize=5`;
    this.groupsService.getAllGroups(endPoint).subscribe(resp => {
      if (resp && resp.groups && resp.groups.length > 0) {
        this.groupsList = resp.groups;
        this.groupsListDetails = [...this.groupsListDetails, ...this.groupsList];
        this.totalGroupsCount = resp.totalCount;
      }
    });
  }

  getAllGroupDetails(initialState?) {
    let endPoint = '';
    if (initialState) {
      this.groupsListDetails = [];
      endPoint = `group/Groups?pageNo=${this.groupsPageNumber}&pageSize=50&adminsSize=4&membersSize=5`;
    } else {
      endPoint = `group/Groups?pageNo=${this.groupsPageNumber}&pageSize=20&adminsSize=4&membersSize=6`;
    }
    this.groupsLoading = true;
    this.noGroups = false;
    this.groupsService.getAllGroups(endPoint).subscribe((resp) => {
      if (resp) {
        this.groupsTotalCount = resp.totalCount;
        let groupsArray = resp.groups;
        if (initialState) {
          this.groupsListDetails = [...this.constMenuItems, ...this.groupsListDetails, ...JSON.parse(JSON.stringify(groupsArray))];
        } else {
          this.groupsListDetails = [...this.groupsListDetails, ...JSON.parse(JSON.stringify(groupsArray))];
        }
      }
      if (this.groupsListDetails.length <= 0) {
        this.noGroups = true;
      } else {
        this.noGroups = false;
      }
      this.groupsLoading = false;
    }, err => {
      this.groupsLoading = false;
    });
  }

  lazyLoadGroups() {

  }

  groupSelected(group, index, myDrop, ev) {
    if (this.activeIndex == index) {
      return;
    }
    ev.stopPropagation();
    myDrop.close();
    this.activeIndex = index;
    this.navigateGroup(this.activeIndex, group, true);
  }

  handleFiles(event) {
    this.selecteEventImageUrl = "";
    this.selecteEventImage = event.target.files[0];
    this.Bloburl = URL.createObjectURL(this.selecteEventImage);
    this.selecteEventImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.Bloburl);
    if(this.eventEditMode){
      this.eventEditModeImageRemoved = 'added';
     }
  }

  removeSelectedImage(event) {
    if (event) {
      event.stopPropagation();
    }
    this.selecteEventImageUrl = "";
    this.selecteEventImage = null;
    URL.revokeObjectURL(this.Bloburl);
    if(this.eventEditMode){
     this.eventEditModeImageRemoved = 'removed';
    }
  }

  resetNewEventObj() {
    Object.keys(this.newEvent).forEach(key => {
      if (key == 'isListPublic') {
        this.newEvent[key] = false;
      } else if (key == 'StartDatetime' || key == 'EndDatetime' || key == 'RsvpByDate') {
        this.newEvent[key] = null;
      } else {
        this.newEvent[key] = "";
      }
    })
  }

  sideBarHide(signUpForm: NgForm) {
    this.removeSelectedImage('');
    this.resetNewEventObj();
    this.eventEditModeImageRemoved = '';
    this.eventEditMode = false;
    signUpForm.reset();
  }

  getMyconnections(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {
      if (initialState) {
        this.myConnections = [];
        endPoint = `user/connections?pageNo=${this.myConnectionsPageNumber}&pageSize=50`;
      } else {
        endPoint = `user/connections?pageNo=${this.myConnectionsPageNumber}&pageSize=20`;
      }
    } else {
      if (initialState) {
        this.myConnections = [];
        endPoint = `user/connections?name=${this.myConnectionSearchTerm}&pageNo=${this.myConnectionsSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `user/connections?name=${this.myConnectionSearchTerm}&pageNo=${this.myConnectionsSearchPageNumber}&pageSize=20`;
      }
    }
    this.showConnectionsLoad = true;
    this.noConnections = false;
    this.connectionsService.getMyConnections(endPoint).subscribe(resp => {
      if (!searchTerm) {
        this.myConnectionsTotalCount = resp.totalCount;
      } else {
        this.myConnectionsSearchTotalCount = resp.totalCount;
      }
      this.myConnections = [...this.myConnections, ...JSON.parse(JSON.stringify(resp.members))];
      if (!searchTerm) {
        this.myConnectionsMasterData = [...this.myConnections];
      }
      if (this.myConnections.length <= 0) {
        this.noConnections = true;
        if (searchTerm) {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Connections found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Connections Found' });
        }
      } else {
        this.noConnections = false;
      }
      this.showConnectionsLoad = false;
    });
  }

  lazyLoadMyConnections() {
    if (this.searchTermResults) {
      if (this.myConnections.length < this.myConnectionsSearchTotalCount && (this.myConnectionsSearchTotalCount != 0)) {
        this.myConnectionsSearchPageNumber = this.myConnectionsSearchPageNumber + 1;
        this.getMyconnections(false, true);
      }
    } else {
      if (this.myConnections.length < this.myConnectionsTotalCount && (this.myConnectionsTotalCount != 0)) {
        this.myConnectionsPageNumber = this.myConnectionsPageNumber + 1;
        this.getMyconnections(false);
      }
    }
  }

  filterBySearch(searchTerm) {
    let term = searchTerm ? searchTerm.toLowerCase() : '';
    if (term) {
      this.myConnectionsSearchTotalCount = 0;
      this.myConnectionsSearchPageNumber = 1;
      this.searchTermResults = true;
      this.getMyconnections(true, true);
    } else {
      // nothing to do because no search criteria provided
    }
  }

  clearSearch(searchTerm, clearOnlyValues?) {
    this.myConnectionSearchTerm = '';
    if (clearOnlyValues) {
      this.myConnectionsSearchTotalCount = 0;
      this.myConnectionsSearchPageNumber = 1;
      this.searchTermResults = false;
      this.noConnections = false;
      return;
    }
    if (this.searchTermResults && this.myConnectionsMasterData.length > 0) {
      this.myConnectionsSearchTotalCount = 0;
      this.myConnectionsSearchPageNumber = 1;
      this.searchTermResults = false;
      this.noConnections = false;
      this.myConnections = [...this.myConnectionsMasterData];
    } else {
      this.searchTermResults = false;
      this.myConnectionsTotalCount = 0;
      this.myConnectionsPageNumber = 1;
      if (!this.noConnections) {
        this.getMyconnections(true);
      }
    }
  }

  open(content, actionLabel?) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      container: '#events-modal-ref',
      keyboard: false,
      centered: true,
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    };

    if (actionLabel && actionLabel == 'Invite Members') {
      let largeModal: NgbModalOptions = {
        centered: false
      }
      ngbModalOptions = { ...ngbModalOptions, ...largeModal };
    }

    if (actionLabel && actionLabel == 'Event Members') {
      let largeModal: NgbModalOptions = {
        size: 'xl',
        centered: false
      }
      ngbModalOptions = { ...ngbModalOptions, ...largeModal };
    }


    this.modalReference = this.modalService.open(content, ngbModalOptions);
    this.modalReference.result.then((result) => {
      this.currentActionEventIndex = null;
      this.currentActionEventObj = null;
    }, (reason) => {
    });
  }

  lazyLoadEvents(){
    if (this.activeTopTabIndex == 2) {
      if(this.pendingEventsList.length < this.pendingEventsListTotalCount){
        this.pendingEventsListPageNumber =this.pendingEventsListPageNumber +1;
        this.getMyEventsInvitations(false);
      }
    } else if (this.activeTopTabIndex == 3) {
      if(this.rejectedEventsList.length < this.rejectedEventsListTotalCount){
        this.rejectedEventsListPageNumber =this.rejectedEventsListPageNumber +1;
        this.getMyRejectedEvents(false);
      }
    } else if (this.activeTopTabIndex == 0 || this.activeTopTabIndex == 1 || !this.activeTopTabIndex) {
      if (this.activeIndex == 0 || this.activeIndex == 1) {
        if(this.eventsList.length < this.eventsListTotalCount){
          this.eventsListPageNumber =this.eventsListPageNumber +1;
          this.getEvents(false);
        }
      }
    }
  }

  getEvents(initialState?) {
    if (this.getEventsSubscription) {
      this.getEventsSubscription.unsubscribe();
    }
    let optionalUrl = this.formatUrl(this.activeTopTabIndex == 0 ? true : false, this.activeTopTabIndex == 1 ? true : false, this.activeIndex == 0 ? 0 : (this.activeIndex == 1 ? 2 : null), this.selectedGroupId ? this.selectedGroupId : null, name);
    this.showEventsLoading = true;
    let endPoint = `event/My?${optionalUrl}&pageNumber=${this.eventsListPageNumber}&pageSize=100`;
    if(initialState){
      this.eventsList = [];
      this.eventsListTotalCount = 0;
      this.eventsListPageNumber = 1;
      endPoint = `event/My?${optionalUrl}&pageNumber=${this.eventsListPageNumber}&pageSize=3`;
    } else {
      endPoint = `event/My?${optionalUrl}&pageNumber=${this.eventsListPageNumber}&pageSize=3`;
    }
    this.getEventsSubscription = this.userEvents.getEvents(endPoint).subscribe(resp => {
      this.showEventsLoading = false;
      if (resp) {
        this.eventsListTotalCount = resp.totalCount;
        if (resp.events.length) {
          resp.events.forEach(event => {
            event.createdByMe = event.createdById == this.loggedInUserDetails?.profileId;
          });
        }
        this.eventsList = [...this.eventsList,...resp.events];
        if (this.eventsList.length) {
          this.noEvents = false;
        } else {
          this.noEvents = true;
        }
      }
    });
  }

  getMyEventsInvitations(initialState?) {
    this.showEventsLoading = true;
    let optionalUrl = this.formatPendingUrl(this.activeIndex == 0 ? 0 : (this.activeIndex == 1 ? 2 : null), this.selectedGroupId ? this.selectedGroupId : null, null);
    let endPoint = `event/pending?status=invited&${optionalUrl}&pageNo=${this.pendingEventsListPageNumber}&pageSize=50`;
    if(initialState){
      this.pendingEventsList = [];
      this.pendingEventsListTotalCount = 0;
      this.pendingEventsListPageNumber = 1;
      endPoint = `event/pending?status=invited&${optionalUrl}&pageNo=${this.pendingEventsListPageNumber}&pageSize=50`;
    } else {
      endPoint = `event/pending?status=invited&${optionalUrl}&pageNo=${this.pendingEventsListPageNumber}&pageSize=50`;
    }
    this.userEvents.getMyEventsInvitations(endPoint).subscribe(resp => {
      if (resp) {
        this.showEventsLoading = false;
        this.pendingEventsList = [...this.pendingEventsList,...resp.invitations];
        this.pendingEventsListTotalCount = resp.totalCount;
        if (this.pendingEventsList.length) {
          this.noEvents = false;
        } else {
          this.noEvents = true;
        }
      }
    })
  }

  getMyRejectedEvents(initialState?) {
    this.showEventsLoading = true;
    let optionalUrl = this.formatUrl(this.activeTopTabIndex == 0 ? true : false, this.activeTopTabIndex == 1 ? true : false, this.activeIndex == 0 ? 0 : (this.activeIndex == 1 ? 2 : null), this.selectedGroupId ? this.selectedGroupId : null, name);
    let endPoint = `event/rejected?${optionalUrl}&pageNumber=${this.rejectedEventsListPageNumber}&pageSize=50`;
    if(initialState){
      this.rejectedEventsList = [];
      this.rejectedEventsListTotalCount = 0;
      this.rejectedEventsListPageNumber = 1;
      endPoint = `event/rejected?${optionalUrl}&pageNumber=${this.rejectedEventsListPageNumber}&pageSize=50`;
    } else {
      endPoint = `event/rejected?${optionalUrl}&pageNumber=${this.rejectedEventsListPageNumber}&pageSize=50`; 
    }
    this.noEvents = false;
    this.userEvents.getMyRejectedEvents(endPoint).subscribe(resp => {
      if (resp) {
        this.showEventsLoading = false;
        this.rejectedEventsList =[...this.rejectedEventsList, ...resp.invitations];
        this.rejectedEventsListTotalCount = resp.totalCount;
        if (this.rejectedEventsList.length) {
          this.noEvents = false;
        } else {
          this.noEvents = true;
        }
      }
    })
  }

  formatUrl(createdByMe?: boolean, updcoming?: boolean, groupTypeId?: number, groupId?: any, name?: any): string {
    let URL = [];
    if (createdByMe) {
      URL.push('createdByMe=true');
    }
    // else {
    //    URL.push('createdByMe=false');  
    // }

    if (updcoming) {
      URL.push('upcoming=true');
    }
    else {
      URL.push('upcoming=false');
    }
    if (name) {
      URL.push(`name=${name}`);
    }
    if (groupId) {
      URL.push(`GroupID=${groupId}`);
    }
    if (groupTypeId != null && groupTypeId >= 0) {
      URL.push(`GroupTypeId=${groupTypeId}`);
    }
    return URL.join('&');
  }

  getEventDetails(eventId, index) {
    let endPoint = `event/${eventId}`;
    this.userEvents.getEventDetails(endPoint).subscribe(resp => {
      if(resp){
        let objj = resp?.events.length?resp.events[0]: {};
        let obj = {...this.currentActionEventObj, ...objj};
        this.eventsList.splice(index, 1, obj);
      }
    }, err=>{})
  }

  CreateEvent(createEventForm: NgForm) {
    if (!this.eventEditMode) {
      let endPoint = 'event';
      if (this.currentSelectedGoup) {
        endPoint = `event/?groupid=${this.currentSelectedGoup.id}`;
      }

      if (createEventForm.valid) {
        let payLoad: any = Object.assign({}, this.newEvent);
        let evTypeIndex = this.eventTypes.findIndex(item => item.id == this.newEvent.EventTypeId);
        payLoad.EventTypeId = payLoad.EventTypeId.toString();
        payLoad.isListPublic = payLoad.isListPublic? payLoad.isListPublic: false;
        if (!payLoad.EndDatetime) {
          payLoad.EndDatetime = payLoad.StartDatetime;
        }
        if (evTypeIndex != -1) {
          payLoad.For = this.eventTypes[evTypeIndex].description;
        }
        let body: FormData = new FormData();
        if (this.selecteEventImage) {
          body.append('FileProfile', this.selecteEventImage);
        }
        body.append('PostData', JSON.stringify(payLoad));
        this.userEvents.createEvent(endPoint, body).subscribe(resp => {
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: this.currentSelectedGoup ? 'Group Event created successfully' : `Personel Event created successfully` });
          this.showCreateEventBar = false;
          this.removeSelectedImage('');
          this.navigateGroup(this.activeIndex, this.currentSelectedGoup ? this.currentSelectedGoup : '', true);
        });
      } else {
        createEventForm.form.markAllAsTouched();
        this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please enter all required fields' });
      }
    } else {
      this.updateEvent();
    }

  }

  setEditEventData() {
    this.newEvent.EventTypeId = this.currentActionEventObj.eventTypeId;
    this.newEvent.Name = this.currentActionEventObj.name;
    this.newEvent.For = this.currentActionEventObj.for;
    this.newEvent.isListPublic = this.currentActionEventObj.isListPublic? true: false;
    this.newEvent.StartDatetime = this.currentActionEventObj.startDatetime ? new Date(this.currentActionEventObj.startDatetime) : null;
    this.newEvent.EndDatetime = this.currentActionEventObj.endDatetime ? new Date(this.currentActionEventObj.endDatetime) : null;
    this.newEvent.Location = this.currentActionEventObj.location;
    this.newEvent.Street1 = this.currentActionEventObj.street1;
    this.newEvent.Street2 = this.currentActionEventObj.street2;
    this.newEvent.City = this.currentActionEventObj.city;
    this.newEvent.State = this.currentActionEventObj.state;
    this.newEvent.ZipPin = this.currentActionEventObj.zipPin;
    this.newEvent.RsvpByDate = this.currentActionEventObj.rsvpByDate ? new Date(this.currentActionEventObj.rsvpByDate) : null;
    this.selecteEventImageUrl = this.currentActionEventObj.eventImageUrl?this.filesBaseURL+this.currentActionEventObj.eventImageUrl: '';
  }

  updateEvent() {
    let endPoint = 'event/?deleteImage=true';
    if(this.eventEditModeImageRemoved == 'added' || this.eventEditModeImageRemoved == 'removed'){
     endPoint = 'event/?deleteImage=true';  
    } else if(!this.eventEditModeImageRemoved){
      endPoint = 'event/?deleteImage=false';  
    }
    let payLoad: any = Object.assign({}, this.newEvent);
    let evTypeIndex = this.eventTypes.findIndex(item => item.id == this.newEvent.EventTypeId);
    payLoad.EventTypeId = payLoad.EventTypeId.toString();
    if (!payLoad.EndDatetime) {
      payLoad.EndDatetime = payLoad.StartDatetime;
    }
    if (evTypeIndex != -1) {
      payLoad.For = this.eventTypes[evTypeIndex].description;
    }
    payLoad.id = this.currentActionEventObj.id;
    payLoad.groupid = this.currentActionEventObj.groupid;
    payLoad.postId = this.currentActionEventObj.postId;
    let body: FormData = new FormData();
    if (this.selecteEventImage) {
      body.append('FileProfile', this.selecteEventImage);
    }
    body.append('PostData', JSON.stringify(payLoad));
    this.userEvents.updateEvent(endPoint, body).subscribe(resp => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Event details updated' });
      this.getEventDetails(this.currentActionEventObj.id, this.currentActionEventIndex);
      this.showCreateEventBar = false;
      this.removeSelectedImage('');
    });
  }

  deleteEvent(modalRef) {
    let endPoint = `Event/${this.currentActionEventObj.id}`;
    this.userEvents.deleteEvent(endPoint).subscribe(resp => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Event removed successfully' });
      this.eventsList.splice(this.currentActionEventIndex, 1);
      modalRef.dismiss('Cross click');
    });
  }

  inviteUsersToPrivateEvent(member) {
    let endPoint = `event/${this.currentActionEventObj.id}/invite`;
    let id = member.whoInvited == 'me' ? member.profileId2 : member.profileId1;
    let invitedProfileID = [id];
    let payLoad = {
      "profileIDs": invitedProfileID
    }
    this.userEvents.inviteUsersToPrivateEvent(endPoint, payLoad).subscribe(resp => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Invited to event' });
      member.invited = true;
    })

  }

  getInvitedUsersForMyEvent() {
    let endPoint = 'event/4f0ef55e-93e8-48d2-8855-e04c90233c65/members?name=&status=accepted&pageNo=1&pageSize=5';
    this.userEvents.getInvitedMembersList(endPoint).subscribe(resp => {

    })
  }

  respondToEventInvitation(event, action, confirmation?, evIndex?) {
    let endPoint = `event/${confirmation ? event.id : event.eventId}/invite/inviteeaction?Status=${action}`;
    this.userEvents.respondToEventInvitation(endPoint).subscribe(resp => {
      event.actionStatus = action;
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Event Status Updated successfully' });
      if(this.activeTopTabIndex == 0 || this.activeTopTabIndex == 1 || !this.activeTopTabIndex){
        this.getEventDetails(confirmation ? event.id : event.eventId, evIndex);
      } else {
        this.navigateGroup(this.activeIndex, this.currentSelectedGoup ? this.currentSelectedGoup : '', true);
      }
    }); 
  }

  updateEventStatus(event, eventIndex?) {
    this.confirmationService.confirm({
      message: `Your Current Event status is ${event.status ? event.status : event.invitationStatus}`,
      header: `Confirm Event Status for ${event.name}`,
      icon: 'pi pi-info-circle',
      acceptLabel: 'Update',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-rounded b-btn-sm b-primary-btn',
      rejectButtonStyleClass: 'p-button-rounded b-btn-sm float-right b-secondary-btn',
      accept: () => {
        this.currentActionEventObj = event;
        this.respondToEventInvitation(event, event.status ? event.status.toLowerCase() : event.invitationStatus.toLowerCase(), event.invitationStatus ? true : false, eventIndex);
      },
      reject: (type) => {
        this.currentActionEventObj = null;
      }
    });
  }

  formatPendingUrl(groupTypeId?: number, groupId?: any, name?: any): string {
    let URL = [];
    if (name) {
      URL.push(`name=${name}`);
    }
    if (groupId) {
      URL.push(`GroupID=${groupId}`);
    }
    if (groupTypeId != null && groupTypeId >= 0) {
      URL.push(`GroupTypeId=${groupTypeId}`);
    }
    return URL.join('&');
  }

  showCreateEvent() {
    if (this.currentSelectedGoup) {
      if (this.currentSelectedGoup.groupMemberType == 'Member') {
        this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Only Group Admins have access to create Group Events' });
        return;
      }
    }
    this.showCreateEventBar = true
  }

  cancelCreateHide() {
    this.showCreateEventBar = false;
  }

  closeConnectionModal(modalRef){
    if(this.myConnections.length){
      this.myConnections.forEach(connection =>{
        connection.invited = null;
      });
    }
    modalRef.dismiss('Cross click');
  }

}
