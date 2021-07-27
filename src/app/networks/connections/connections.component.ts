import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { MessageService } from 'primeng/api';
import { filesBaseURL } from './../../common/global.constants';
import { inviteeRelationnshipResp, members, searchMember } from './../../groups/groups.model';
import { GroupsService } from './../../groups/groups.service';
import { ConnectionsService } from './../../services/connections.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { GlobalNavigateService } from './../../services/global.navigate.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.less']
})
export class ConnectionsComponent implements OnInit , OnDestroy , AfterViewInit{

  relationshipType: Array<any> = [];
  loggedInUserId: any = '';
  filesBaseURL: any;
  activeTabIndex: number = 0;
  activeTabName: string = 'Connections';
  connectionTabs: Array<any> = [
    {
      label: 'Connections'
    },
    {
      label: 'Pending Invitations'
    },
    {
      label: 'Sent Invitations'
    }
  ];


  memberSearchClicked: boolean = false;
  @ViewChild('inviteForConnectionModal') inviteForConnectionModal;
  modalReference: any = '';

  @Output('connectinsList') connectinsList = new EventEmitter();

  loadingItems: Array<any> = [1, 2, 3, 4];
  showSkeliton: boolean = false;
  loadingApi:boolean = false;
  searchTermResults: boolean = false;
  searchTerm: any = '';
  //my connections variables
  myConnectionsTotalCount: number = 0;
  myConnectionsSearchTotalCount: number = 0;
  myConnectionsPageNumber: number = 1;
  myConnectionsSearchPageNumber: number = 1;
  myConnections: Array<any> = [];
  myConnectionsMasterData: Array<any> = [];
  noConnections: boolean = false;

  //sent invitations variables
  sentInvitationsTotalCount: number = 0;
  sentInvitationsSearchTotalCount: number = 0;
  sentInvitationsPageNumber: number = 1;
  sentInvitationsSearchPageNumber: number = 1;
  sentInvitations: Array<any> = [];
  sentInvitationsMasterData: Array<any> = [];
  noSentInvitations: boolean = false;

  //pending invitations variables
  pendingInvitationsTotalCount: number = 0;
  pendingInvitationsSearchTotalCount: number = 0;
  pendingInvitationsPageNumber: number = 1;
  pendingInvitationsSearchPageNumber: number = 1;
  pendingInvitations: Array<any> = [];
  pendingInvitationsMasterData: Array<any> = [];
  noPendingInvitations: boolean = false;

  //new people search results variables

  newSearchProfileTotalCount: number = 0;
  newSearchProfilePageNumber: number = 1;
  newSearchProfiles: Array<any> = [];
  newSearchProfileMasterData: Array<any> = [];
  nonewSearchProfile: boolean = false;
  showConnectionsLoad: boolean = false;
  newConnectionsSearchTerm:string = '';
  newConnectionsSearchTermInfinite:string = '';
  initialnewConnectionsSearch:boolean =  false;
  navigationSubscription:Subscription;

  constructor(private connectionsService: ConnectionsService,
    private groupService: GroupsService,
    public messageService: MessageService,
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router,
    private globalNavigateService:GlobalNavigateService) {
    this.loggedInUserId = this.authService.getLoggedInUserProfileId();
  }

  ngOnInit(): void {
    this.filesBaseURL = filesBaseURL;
    this.getRelationShipTypes();
    setTimeout(()=>{
      if(!this.loadingApi){
      this.tabClick(this.activeTabIndex, this.activeTabName, true);
      }
    }, 500);
  }

  ngAfterViewInit(){
    this.navigationSubscription = this.globalNavigateService.globalNavigationEvent.subscribe(action =>{
      if(action && action !=null){
        if(action.NAVIGATION_PAGE =='NETWORK'){
          if(action.SHOW_SIDEBAR){
             
          }
          if(action.SUB_SCREEN_NAVOPTIONS){
            let SUB_OPTIONS = action.SUB_SCREEN_NAVOPTIONS;
            if(SUB_OPTIONS.NAVIGATION_PAGE =='MYCONNECTIONS'){
            if(SUB_OPTIONS.ACTIVE_TAB_INDEX >=0){
              if(SUB_OPTIONS.ACTIVE_TAB_INDEX == 0){
                this.activeTabIndex = 0;
                this.activeTabName = 'Connections';
                this.myConnections = [];
                this.myConnectionsMasterData = [];
                this.tabClick(this.activeTabIndex, this.activeTabName, true);
              }  else if(SUB_OPTIONS.ACTIVE_TAB_INDEX == 1){
                this.activeTabIndex = 1;
                this.activeTabName = 'Pending Invitations';
                this.pendingInvitations = [];
                this.pendingInvitationsMasterData = [];
                this.tabClick(this.activeTabIndex, this.activeTabName, true);
              } else if(SUB_OPTIONS.ACTIVE_TAB_INDEX == 2){
                this.activeTabIndex = 2;
                this.activeTabName = 'Sent Invitations';
                this.sentInvitations = [];
                this.sentInvitationsMasterData = [];
                this.tabClick(this.activeTabIndex, this.activeTabName, true);
              }

              if(SUB_OPTIONS.SHOW_SIDEBAR){
               setTimeout(()=>{
                this.inviteClicked();
               }, 3000)
              }
            }
          }
          }
         
        }
      }
    });
  }

  getRelationShipTypes() {
    let endPiont = `user/RelationshipTypes`;
    this.connectionsService.getRelationShipTypes(endPiont).subscribe(resp => {
      this.relationshipType = resp;
    });
  }


  getPendingInvitations(initialState?, searchTerm?) {
    if(!this.loadingApi){
      this.loadingApi = true;
      let endPoint = ``;
      if (!searchTerm) {// executing when there is no search criteria
        if (initialState) {
          this.pendingInvitations = [];
          endPoint = `user/connections/pending?pageNo=${this.pendingInvitationsPageNumber}&pageSize=50`;
        } else {
          endPoint = `user/connections/pending?pageNo=${this.pendingInvitationsPageNumber}&pageSize=20`;
        }
      } else {// executing when there is search criteria
        if (initialState) {
          this.pendingInvitations = [];
          endPoint = `user/connections/pending?name=${this.searchTerm}&pageNo=${this.pendingInvitationsSearchPageNumber}&pageSize=50`;
        } else {
          endPoint = `user/connections/pending?name=${this.searchTerm}&pageNo=${this.pendingInvitationsSearchPageNumber}&pageSize=20`;
        }
      }
      this.showSkeliton = true;
      this.noPendingInvitations = false;
      this.connectionsService.getPendingInvitations(endPoint).subscribe((resp: any) => {
        if (resp) {
          if (!searchTerm) {
            this.pendingInvitationsTotalCount = resp.totalCount;
          } else {
            this.pendingInvitationsSearchTotalCount = resp.totalCount;
          }
          this.pendingInvitations = [...this.pendingInvitations, ...JSON.parse(JSON.stringify(resp.members))];
          if (!searchTerm) {
            this.pendingInvitationsMasterData = [...this.pendingInvitations];
          }
        }
        if (this.pendingInvitations.length <= 0) {
          this.noPendingInvitations = true;
          if (searchTerm) {
            this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Pending Invitations not found with given search criteria' });
          } else {
            this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Pending Invitations' });
          }
  
        } else {
          this.noPendingInvitations = false;
        }
        this.showSkeliton = false;
        this.loadingApi = false;
      }, err=>{
        this.loadingApi = false;
      });
    }
  }

  getSentInvitations(initialState?, searchTerm?) {
    if(!this.loadingApi){
      let endPoint = ``;
      if (!searchTerm) {// executing when there is no search criteria
        if (initialState) {
          this.sentInvitations = [];
          endPoint = `user/connections/sentinvitation?pageNo=${this.sentInvitationsPageNumber}&pageSize=50`;
        } else {
          endPoint = `user/connections/sentinvitation?pageNo=${this.sentInvitationsPageNumber}&pageSize=20`;
        }
      } else {// executing when there is search criteria
        if (initialState) {
          this.sentInvitations = [];
          endPoint = `user/connections/sentinvitation?name=${this.searchTerm}&pageNo=${this.sentInvitationsSearchPageNumber}&pageSize=50`;
        } else {
          endPoint = `user/connections/sentinvitation?name=${this.searchTerm}&pageNo=${this.sentInvitationsSearchPageNumber}&pageSize=20`;
        }
      }
      this.showSkeliton = true;
      this.loadingApi = true;
      this.noSentInvitations = false;
      this.connectionsService.getSentInvitations(endPoint).subscribe((resp: any) => {
        if (resp) {
          if (!searchTerm) {
            this.sentInvitationsTotalCount = resp.totalCount;
          } else {
            this.sentInvitationsSearchTotalCount = resp.totalCount;
          }
          this.sentInvitations = [...this.sentInvitations, ...JSON.parse(JSON.stringify(resp.members))];
          if (!searchTerm) {
            this.sentInvitationsMasterData = [...this.sentInvitations];
          }
        }
        if (this.sentInvitations.length <= 0) {
          this.noSentInvitations = true;
          if (searchTerm) {
            this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Sent Invitations not found with given search criteria' });
          } else {
            this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Sent Invitations' });
          }
  
        } else {
          this.noSentInvitations = false;
        }
        this.showSkeliton = false;
        this.loadingApi = false;
      }, err=>{
        this.loadingApi = false;
      });
    }
  }

  searchMembers(searchTerm, searchForm: NgForm){
    if (searchForm.valid) {
      this.newSearchProfilePageNumber = 1;
      this.initialnewConnectionsSearch = true;
      this.newConnectionsSearchTermInfinite = searchTerm;
       this.getMembersToAdd(true);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please provide Search Text' });
    }
  }

  clearSearchMember(){
    this.initialnewConnectionsSearch = false;
    this.newConnectionsSearchTerm = '';
    this.newConnectionsSearchTermInfinite = '';
    this.newSearchProfilePageNumber =1; 
    this.newSearchProfiles = [];
    this.nonewSearchProfile = false;
  }


  getMembersToAdd(initialState): void {
    let endPoint = '';
     if(initialState){
      this.newSearchProfiles = [];
      endPoint = `User/search?name=${this.newConnectionsSearchTerm}&pageNumber=${this.newSearchProfilePageNumber}&pagesize=50`;
     } else {
      endPoint = `User/search?name=${this.newConnectionsSearchTermInfinite}&pageNumber=${this.newSearchProfilePageNumber}&pagesize=20`; 
     }
     this.showConnectionsLoad = true;
     this.nonewSearchProfile = false;
      this.groupService.getMembersToAdd(endPoint).subscribe((resp: any) => {
        if (resp) {
          this.newSearchProfileTotalCount = resp.totalCount;
          let usersList:Array<any> = [];
          resp.users.forEach(user => {
            let users: members = {
              profileName: user.firstName + ' ' + user.lastName,
              profileId: user.profileId,
              profileImageUrl: user.profileImageUrl,
              profileCoverImageUrl: user.profileCoverImageUrl
            }
            usersList.push(users);
          });
          this.newSearchProfiles = [...this.newSearchProfiles, ...usersList];
        }
        if (this.newSearchProfiles.length <= 0) {
          this.nonewSearchProfile = true;
            this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No members found with given search criteria' });
        } else {
          this.nonewSearchProfile = false;
        }
        this.showConnectionsLoad = false;
      });
  }

  clearMemberSearch(){

  }

  inviteForConnection(person: members, inviteForm: NgForm) {
    inviteForm.control.markAllAsTouched();
    if (inviteForm.valid && person.selectedRelationShipType.id != 0) {
      let endPoint = `user/InviteRelationship/${person.profileId}/${person.selectedRelationShipType.id}`;
      this.connectionsService.inviteForRelationShip(endPoint).subscribe(resp => {
        person.invited = true;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Invitation sent successfully' });
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please select Relationship type' });
    }
  }

  acceptReject(action, person, acceptRelationForm: NgForm) {
    let endPoint = `user/{InvitedByProfileId}/inviteeaction?InviteeRelationshipTypeId=1&isAccepted=true&isBloc
    ked=false`;
    if (action == 'accept') {
      if (acceptRelationForm.valid && person.selectedRelationShipType.id != 0) {
        endPoint = `user/${person.profileId1}/inviteeaction?InviteeRelationshipTypeId=${person.selectedRelationShipType.id}&isAccepted=true&isBlocked=false`;
        this.connectionsService.acceptRejectInvitation(endPoint).subscribe(resp => {
          person.respondedLabel = 'Accepted';
          person.invitationStatus = 'Invitee accepted'
        });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please select Relationship Type' });
      }

    } else if (action == 'reject') {
      endPoint = `user/${person.profileId1}/inviteeaction?InviteeRelationshipTypeId=${1}&isAccepted=false&isBlocked=false`;
      this.connectionsService.acceptRejectInvitation(endPoint).subscribe(resp => {
        person.respondedLabel = 'Rejected';
        person.invitationStatus = 'Invitee rejected'
      });
    }

  }

  getMyConnections(initialState?, searchTerm?) {
    if(!this.loadingApi){
  // let endPoint = `user/connections?pageNo=1&pageSize=5`;
  let endPoint = '';
  if (!searchTerm) {// executing when there is no search criteria
    if (initialState) {
      this.myConnections = [];
      endPoint = `user/connections?pageNo=${this.myConnectionsPageNumber}&pageSize=50`;
    } else {
      endPoint = `user/connections?pageNo=${this.myConnectionsPageNumber}&pageSize=20`;
    }
  } else {// executing when there is search criteria
    if (initialState) {
      this.myConnections = [];
      endPoint = `user/connections?name=${this.searchTerm}&pageNo=${this.myConnectionsSearchPageNumber}&pageSize=50`;
    } else {
      endPoint = `user/connections?name=${this.searchTerm}&pageNo=${this.myConnectionsSearchPageNumber}&pageSize=20`;
    }
  }
  this.loadingApi = true;
  this.showSkeliton = true;
  this.noConnections = false;
  this.connectionsService.getMyConnections(endPoint).subscribe(resp => {
    if (resp) {
      if (!searchTerm) {
        this.myConnectionsTotalCount = resp.totalMembersCount;
      } else {
        this.myConnectionsSearchTotalCount = resp.totalMembersCount;
      }
      this.myConnections = [...this.myConnections, ...JSON.parse(JSON.stringify(resp.members))];
      if (!searchTerm) {
        this.myConnectionsMasterData = [...this.myConnections];
      }
    }
    if (this.myConnections.length <= 0) {
      this.noConnections = true;
      if (searchTerm) {
        this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Connection not found with given search criteria' });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Connections' });
      }

    } else {
      this.noConnections = false;
    }
    this.showSkeliton = false;
    this.loadingApi = false;
  } , err=>{
    this.loadingApi = false;
  });
    }
  }


  tabClick(tabIndex, Tablabel, initialLoad?) {
    if (tabIndex != this.activeTabIndex || initialLoad) {
      this.activeTabIndex = tabIndex;
      this.activeTabName = Tablabel;
      this.showSkeliton = false;
      this.loadingApi = false;
      this.searchTerm = '';
      if (Tablabel == 'Connections') {
        if (this.searchTermResults) {
          this.myConnectionsSearchPageNumber = 1;
          this.myConnectionsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noConnections = false;
        if (!initialLoad && this.myConnectionsMasterData.length > 0) {
          this.myConnections = [...this.myConnectionsMasterData];
        } else {
          this.myConnectionsTotalCount = 0;
          this.myConnectionsPageNumber = 1;
          this.getMyConnections(true);
        }
      } else if (Tablabel == 'Pending Invitations') {
        if (this.searchTermResults) {
          this.pendingInvitationsSearchPageNumber = 1;
          this.pendingInvitationsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noPendingInvitations = false;
        if (!initialLoad && this.pendingInvitationsMasterData.length > 0) {
          this.pendingInvitations = [...this.pendingInvitationsMasterData];
        } else {
          this.pendingInvitationsTotalCount = 0;
          this.pendingInvitationsPageNumber = 1;
          this.getPendingInvitations(true);
        }
      } else if (Tablabel == 'Sent Invitations') {
        if (this.searchTermResults) {
          this.sentInvitationsSearchPageNumber = 1;
          this.sentInvitationsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noSentInvitations = false;
        if (!initialLoad && this.sentInvitationsMasterData.length > 0) {
          this.sentInvitations = [...this.sentInvitationsMasterData];
        } else {
          this.sentInvitationsTotalCount = 0;
          this.sentInvitationsPageNumber = 1;
          this.getSentInvitations(true);
        }
      }
    }
  }

  filterBySearch(selectedTab, searchTerm) {
    let term = searchTerm ? searchTerm.toLowerCase() : '';
    if (selectedTab == 'Connections') {
      if (term) {
        this.myConnections = [];
        this.myConnectionsSearchTotalCount = 0;
        this.myConnectionsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getMyConnections(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    } else if (selectedTab == 'Pending Invitations') {
      if (term) {
        this.pendingInvitations = [];
        this.pendingInvitationsSearchTotalCount = 0;
        this.pendingInvitationsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getPendingInvitations(true, true);
      } else {
        // nothing to do because no search criteria provided
      }

    } else if (selectedTab == 'Sent Invitations') {
      if (term) {
        this.sentInvitations = [];
        this.sentInvitationsSearchTotalCount = 0;
        this.sentInvitationsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getSentInvitations(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    }
  }

  clearSearch(selectedTab, searchTerm) {
    this.searchTerm = '';
    if (selectedTab == 'Connections') {
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
        this.noConnections = true;
        // if (!this.noGroupMembers) {
        //   this.getGroupMembers(true);
        // }
      }
    } else if (selectedTab == 'Pending Invitations') {
      if (this.searchTermResults) {
        if (this.searchTermResults && this.pendingInvitationsMasterData.length > 0) {
          this.pendingInvitationsSearchTotalCount = 0;
          this.pendingInvitationsSearchPageNumber = 1;
          this.searchTermResults = false;
          this.noPendingInvitations = false;
          this.pendingInvitations = [...this.pendingInvitationsMasterData];
        } else {
          this.searchTermResults = false;
          this.pendingInvitationsTotalCount = 0;
          this.pendingInvitationsPageNumber = 1;
          this.noPendingInvitations = true;
        }
      } 
    } else if (selectedTab == 'Sent Invitations') {
      if (this.searchTermResults && this.sentInvitationsMasterData.length > 0) {
        this.sentInvitationsSearchTotalCount = 0;
        this.sentInvitationsSearchPageNumber = 1;
        this.searchTermResults = false;
        this.noSentInvitations = false;
        this.sentInvitations = [...this.sentInvitationsMasterData];
      } else {
        this.searchTermResults = false;
        this.sentInvitationsTotalCount = 0;
        this.sentInvitationsPageNumber = 1;
        this.noSentInvitations = true;
        // if (!this.noSentInvitations) {
        //   this.getSentInvitations(true);
        // }
      }

    }
  }

  lazyLoad() {
    if (this.activeTabName == 'Connections') {
      if (this.searchTermResults) {
        if (this.myConnections.length < this.myConnectionsSearchTotalCount && (this.myConnectionsSearchTotalCount != 0)) {
          this.myConnectionsSearchPageNumber = this.myConnectionsSearchPageNumber + 1;
          this.getMyConnections(false, true);
        }
      } else {
        if (this.myConnections.length < this.myConnectionsTotalCount && (this.myConnectionsTotalCount != 0)) {
          this.myConnectionsPageNumber = this.myConnectionsPageNumber + 1;
          this.getMyConnections(false);
        }
      }
    } else if (this.activeTabName == 'Pending Invitations') {
      if (this.searchTermResults) {
        if (this.pendingInvitations.length < this.pendingInvitationsSearchTotalCount && (this.pendingInvitationsSearchTotalCount != 0)) {
          this.pendingInvitationsSearchPageNumber = this.pendingInvitationsSearchPageNumber + 1;
          this.getPendingInvitations(false, true);
        }
      } else {
        if (this.pendingInvitations.length < this.pendingInvitationsTotalCount && (this.pendingInvitationsTotalCount != 0)) {
          this.pendingInvitationsPageNumber = this.pendingInvitationsPageNumber + 1;
          this.getPendingInvitations(false);
        }
      }
    } else if (this.activeTabName == 'Sent Invitations') {
      if (this.searchTermResults) {
        if (this.sentInvitations.length < this.sentInvitationsSearchTotalCount && (this.sentInvitationsSearchTotalCount != 0)) {
          this.sentInvitationsSearchPageNumber = this.sentInvitationsSearchPageNumber + 1;
          this.getSentInvitations(false, true);
        }
      } else {
        if (this.sentInvitations.length < this.sentInvitationsTotalCount && (this.sentInvitationsTotalCount != 0)) {
          this.sentInvitationsPageNumber = this.sentInvitationsPageNumber + 1;
          this.getSentInvitations(false);
        }
      }
    }
  }

  open(content, actionLabel?) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      container: '#newConnection',
      keyboard: false,
      centered: false,
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    };


    this.modalReference = this.modalService.open(content, ngbModalOptions);
    this.modalReference.result.then((result) => {

    }, (reason) => {

    });
  }

  inviteClicked() {
    this.open(this.inviteForConnectionModal)
  }

  lazyLoadMyConnections() {
    if (this.newSearchProfiles.length < this.newSearchProfileTotalCount && (this.newSearchProfileTotalCount != 0)) {
      this.newSearchProfilePageNumber = this.newSearchProfilePageNumber + 1;
      this.getMembersToAdd(false);
    }
  }

  navigateToProfile(person){
    this.router.navigate(['testtt/profile', person.whoInvited =='me'? person.profileId2:person.profileId1]);
  }

  ngOnDestroy(){
    this.navigationSubscription.unsubscribe();
  }

  connectionsSearch(searchTerm){
  if(!searchTerm){
    this.clearSearch(this.activeTabName,searchTerm)
  }
  }

}
