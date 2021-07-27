import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { GroupsService } from '../../../groups/groups.service';
import { groups } from '../../../groups/groups.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService, ConfirmationService } from 'primeng/api';
import { filesBaseURL } from './../../../common/global.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { PrimeIcons } from 'primeng/api';
import { UserEventsService } from './../../../services/user.event.service';

@Component({
  selector: 'app-eventinfo',
  templateUrl: './eventinfo.component.html',
  styleUrls: ['./eventinfo.component.less'],
  providers: [ConfirmationService]
})
export class EventinfoComponent implements OnInit {

  @Output('inviteToEventClicked') inviteToEventClicked: EventEmitter<any> = new EventEmitter();
  @Output('callGetEventDetails') callGetEventDetails: EventEmitter<any> = new EventEmitter();
  activeTabIndex: number = 0;
  activeTabName: string = 'Invited Members';
  filesBaseURL: any = '';

  //group info variables

  public _event: any;
  @ViewChild('eventScroll',{static:true}) eventScroll: ElementRef;

  @Input('event') set event(value: any) {
    this._event = JSON.parse(JSON.stringify(value));
  };

  // all tabs members array data passed into this to show in UI

  membersArrayData:Array<any> = [];
  
  //groupmembers tab variables
  eventMembersTotalCount: number = 0;
  eventMembersSearchTotalCount: number = 0;
  eventMembersPageNumber: number = 1;
  eventMembersSearchPageNumber: number = 1;
  eventMembers: Array<any> = [];
  eventMembersMasterData: Array<any> = [];
  noEventMembers: boolean = false;

  //accepted invitations variables
  acceptedInvitationsTotalCount: number = 0;
  acceptedInvitationsSearchTotalCount: number = 0;
  acceptedInvitationsPageNumber: number = 1;
  acceptedInvitationsSearchPageNumber: number = 1;
  acceptedInvitations: Array<any> = [];
  acceptedInvitationsMasterData: Array<any> = [];
  noacceptedInvitations: boolean = false;

  //rejected invitations variables
  rejectedInvitationsTotalCount: number = 0;
  rejectedInvitationsSearchTotalCount: number = 0;
  rejectedInvitationsPageNumber: number = 1;
  rejectedInvitationsSearchPageNumber: number = 1;
  rejectedInvitations: Array<any> = [];
  rejectedInvitationsMasterData: Array<any> = [];
  norejectedInvitations: boolean = false;

  
  //tentative invitations variables
  tentativeInvitationsTotalCount: number = 0;
  tentativeInvitationsSearchTotalCount: number = 0;
  tentativeInvitationsPageNumber: number = 1;
  tentativeInvitationsSearchPageNumber: number = 1;
  tentativeInvitations: Array<any> = [];
  tentativeInvitationsMasterData: Array<any> = [];
  notentativeInvitations: boolean = false;

  members: Array<any> = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ];


  searchTermResults: boolean = false;
  @Input('modalRef') modalRef: any;
  searchTerm: any = '';
  showSkeliton: boolean = false;



  timelineObj = { invitedBy: false, profileName: '', invitationSentTime: null, profileImageUrl: '' };

  loadingItems = [1, 2, 3, 4, 5];

  infoTabs: Array<any> = [
    {
      label: 'Invited Members'
    },
    {
      label: 'Accepted'
    },
    {
      label: 'Rejected'
    },
    {
      label: 'Tentative'
    }
  ];


  memberActionItems: Array<any> = [
    {
      label: 'Remove from Event'
    },
    {
      label: 'Add as Co-Host'
    },
    {
      label: 'Remove Co-Host'
    }
  ];

  constructor(private groupService: GroupsService,
    private modalService: NgbModal,
    public messageService: MessageService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private userEventsService: UserEventsService,) {
    this.filesBaseURL = filesBaseURL;
  }

  ngOnInit(): void {
    this.tabClick(this.activeTabIndex , this.activeTabName, true);
  }

  lazyLoad() {
    if (this.activeTabIndex != 0) {
      if (this.activeTabName == 'Invited Members') {
        if (this.searchTermResults) {
          if (this.eventMembers.length < this.eventMembersSearchTotalCount && (this.eventMembersSearchTotalCount != 0)) {
            this.eventMembersSearchPageNumber = this.eventMembersSearchPageNumber + 1;
            this.getInvitedUsersForMyEvent(false, true);
          }
        } else {
          if (this.eventMembers.length < this.eventMembersTotalCount && (this.eventMembersTotalCount != 0)) {
            this.eventMembersPageNumber = this.eventMembersPageNumber + 1;
            this.getInvitedUsersForMyEvent(false);
          }
        }
      } else if (this.activeTabName == 'Accepted') {
        if (this.searchTermResults) {
          if (this.acceptedInvitations.length < this.acceptedInvitationsSearchTotalCount && (this.acceptedInvitationsSearchTotalCount != 0)) {
            this.acceptedInvitationsSearchPageNumber = this.acceptedInvitationsSearchPageNumber + 1;
            this.getacceptedInvitations(false, true);
          }
        } else {
          if (this.acceptedInvitations.length < this.acceptedInvitationsTotalCount && (this.acceptedInvitationsTotalCount != 0)) {
            this.acceptedInvitationsPageNumber = this.acceptedInvitationsPageNumber + 1;
            this.getacceptedInvitations(false);
          }
        }
      } else if (this.activeTabName == 'Rejected') {
        if (this.searchTermResults) {
          if (this.rejectedInvitations.length < this.rejectedInvitationsSearchTotalCount && (this.rejectedInvitationsSearchTotalCount != 0)) {
            this.rejectedInvitationsSearchPageNumber = this.rejectedInvitationsSearchPageNumber + 1;
            this.getRejectedInvitations(false, true);
          }
        } else {
          if (this.rejectedInvitations.length < this.rejectedInvitationsTotalCount && (this.rejectedInvitationsTotalCount != 0)) {
            this.rejectedInvitationsPageNumber = this.rejectedInvitationsPageNumber + 1;
            this.getRejectedInvitations(false);
          }
        }
      } else if (this.activeTabName == 'Tentative') {
        if (this.searchTermResults) {
          if (this.rejectedInvitations.length < this.rejectedInvitationsSearchTotalCount && (this.rejectedInvitationsSearchTotalCount != 0)) {
            this.rejectedInvitationsSearchPageNumber = this.rejectedInvitationsSearchPageNumber + 1;
            this.getRejectedInvitations(false, true);
          }
        } else {
          if (this.rejectedInvitations.length < this.rejectedInvitationsTotalCount && (this.rejectedInvitationsTotalCount != 0)) {
            this.rejectedInvitationsPageNumber = this.rejectedInvitationsPageNumber + 1;
            this.getTentativeInvitations(false);
          }
        }
      }


    }
  }

  groupMembersActions(actionLabel, member, memberItemIndex?) {
    if(this._event.createdByMe || (this._event.memberType =='Cohost' || this._event.memberType =='Host')){
      if (actionLabel == 'Remove from Event') {
        this.deleteInviteeFromMyEvents(member,memberItemIndex );
      } else if (actionLabel == 'Add as Co-Host') {
        this.addCohostToPrivateEvent(member,memberItemIndex);
      } else if (actionLabel == 'Remove Co-Host') {
        this.deleteCohostToPrivateEvent(member, memberItemIndex);
      }
    } else {
      return ;
    }
  }


  passData(data){
    this.membersArrayData = data.length ? JSON.parse(JSON.stringify(data)): [];
  }

  tabClick(tabIndex, Tablabel, initialLoad?) {
    if (tabIndex != this.activeTabIndex || initialLoad) {
      this.passData([]);
      this.searchTerm = '';
      let element = this.eventScroll.nativeElement;
      element.scrollTop = 0;
      this.activeTabIndex = tabIndex;
      this.activeTabName = Tablabel;
      this.showSkeliton = false;
      if (Tablabel == 'Invited Members') {
        if (this.searchTermResults) {
          this.eventMembersSearchPageNumber = 1;
          this.eventMembersSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noEventMembers = false;
        if (this.eventMembersMasterData.length > 0) {
          this.eventMembers = [...this.eventMembersMasterData];
          this.passData(this.eventMembers);
        } else {
          this.eventMembersTotalCount = 0;
          this.eventMembersPageNumber = 1;
          this.getInvitedUsersForMyEvent(true);
        }
      } else if (Tablabel == 'Accepted') {
        if (this.searchTermResults) {
          this.acceptedInvitationsSearchPageNumber = 1;
          this.acceptedInvitationsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noacceptedInvitations = false;
        if (this.acceptedInvitationsMasterData.length > 0) {
          this.acceptedInvitations = [...this.acceptedInvitationsMasterData];
          this.passData(this.acceptedInvitations);
        } else {
          this.acceptedInvitationsTotalCount = 0;
          this.acceptedInvitationsPageNumber = 1;
          this.getacceptedInvitations(true);
        }
      } else if (Tablabel == 'Rejected') {
        if (this.searchTermResults) {
          this.rejectedInvitationsSearchPageNumber = 1;
          this.rejectedInvitationsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.norejectedInvitations = false;
        if (this.rejectedInvitationsMasterData.length > 0) {
          this.rejectedInvitations = [...this.rejectedInvitationsMasterData];
          this.passData(this.rejectedInvitations);
        } else {
          this.rejectedInvitationsTotalCount = 0;
          this.rejectedInvitationsPageNumber = 1;
          this.getRejectedInvitations(true);
        }
      } else if (Tablabel == 'Tentative') {
        if (this.searchTermResults) {
          this.tentativeInvitationsSearchPageNumber = 1;
          this.tentativeInvitationsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.notentativeInvitations = false;
        if (this.tentativeInvitationsMasterData.length > 0) {
          this.tentativeInvitations = [...this.tentativeInvitationsMasterData];
          this.passData(this.tentativeInvitations);
        } else {
          this.tentativeInvitationsTotalCount = 0;
          this.tentativeInvitationsPageNumber = 1;
          this.getTentativeInvitations(true);
        }
      }
    }
  }

  filterBySearch(searchTerm) {
    this.passData([]);
    let term = searchTerm ? searchTerm.toLowerCase() : '';
    if (this.activeTabName == 'Invited Members') {
      if (term) {
        this.eventMembers = [];
        this.eventMembersSearchTotalCount = 0;
        this.eventMembersSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getInvitedUsersForMyEvent(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    } else if (this.activeTabName  == 'Accepted') {
      if (term) {
        this.acceptedInvitations = [];
        this.acceptedInvitationsSearchTotalCount = 0;
        this.acceptedInvitationsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getacceptedInvitations(true, true);
      } else {
        // nothing to do because no search criteria provided
      }

    } else if (this.activeTabName  == 'Rejected') {
      if (term) {
        this.rejectedInvitations = [];
        this.rejectedInvitationsSearchTotalCount = 0;
        this.rejectedInvitationsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getRejectedInvitations(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    } else if (this.activeTabName  == 'Tentative') {
      if (term) {
        this.tentativeInvitations = [];
        this.tentativeInvitationsSearchTotalCount = 0;
        this.tentativeInvitationsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getTentativeInvitations(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    }
  }

  clearSearch(searchTerm) {
    this.searchTerm = '';
    if (this.activeTabName == 'Invited Members') {
      if (this.searchTermResults && this.eventMembersMasterData.length > 0) {
        this.eventMembersSearchTotalCount = 0;
        this.eventMembersSearchPageNumber = 1;
        this.searchTermResults = false;
        this.noEventMembers = false;
        this.eventMembers = [...this.eventMembersMasterData];
        this.passData(this.eventMembers);
      } else {
        this.searchTermResults = false;
        this.eventMembersTotalCount = 0;
        this.eventMembersPageNumber = 1;
        this.noEventMembers = true;
        // if (!this.noGroupMembers) {
        //   this.getGroupMembers(true);
        // }
      }
    } else if (this.activeTabName == 'Accepted') {
      if (this.searchTermResults) {
        if (this.searchTermResults && this.acceptedInvitationsMasterData.length > 0) {
          this.acceptedInvitationsSearchTotalCount = 0;
          this.acceptedInvitationsSearchPageNumber = 1;
          this.searchTermResults = false;
          this.noacceptedInvitations = false;
          this.acceptedInvitations = [...this.acceptedInvitationsMasterData];
          this.passData(this.acceptedInvitations);
        } else {
          this.searchTermResults = false;
          this.acceptedInvitationsTotalCount = 0;
          this.acceptedInvitationsPageNumber = 1;
          this.noacceptedInvitations = true;
        }
      }
    } else if (this.activeTabName == 'Rejected') {
      if (this.searchTermResults && this.rejectedInvitationsMasterData.length > 0) {
        this.rejectedInvitationsSearchTotalCount = 0;
        this.rejectedInvitationsSearchPageNumber = 1;
        this.searchTermResults = false;
        this.norejectedInvitations = false;
        this.rejectedInvitations = [...this.rejectedInvitationsMasterData];
        this.passData(this.rejectedInvitations);
      } else {
        this.searchTermResults = false;
        this.rejectedInvitationsTotalCount = 0;
        this.rejectedInvitationsPageNumber = 1;
        this.norejectedInvitations = true;
        // if (!this.norejectedInvitations) {
        //   this.getrejectedInvitations(true);
        // }
      }

    } else if (this.activeTabName == 'Tentative') {
      if (this.searchTermResults && this.tentativeInvitationsMasterData.length > 0) {
        this.tentativeInvitationsSearchTotalCount = 0;
        this.tentativeInvitationsSearchPageNumber = 1;
        this.searchTermResults = false;
        this.notentativeInvitations = false;
        this.tentativeInvitations = [...this.tentativeInvitationsMasterData];
        this.passData(this.tentativeInvitations);
      } else {
        this.searchTermResults = false;
        this.tentativeInvitationsTotalCount = 0;
        this.tentativeInvitationsPageNumber = 1;
        this.notentativeInvitations = true;
        // if (!this.notentativeInvitations) {
        //   this.gettentativeInvitations(true);
        // }
      }

    }
  }

  getInvitedUsersForMyEvent(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.eventMembers = [];
        endPoint = `event/${this._event.id}/members?pageNo=${this.eventMembersPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.id}/members?pageNo=${this.eventMembersPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.eventMembers = [];
        endPoint = `event/${this._event.groupid}/members?name=${this.searchTerm}&pageNo=${this.eventMembersSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.groupid}/members?name=${this.searchTerm}&pageNo=${this.eventMembersSearchPageNumber}&pageSize=20`;
      }
    }
    this.showSkeliton = true;
    this.noEventMembers = false;
    this.userEventsService.getInvitedMembersList(endPoint).subscribe(resp => {
      if (resp) {
        if (!searchTerm) {
          this.eventMembersTotalCount = resp.totalCount;
        } else {
          this.eventMembersSearchTotalCount = resp.totalCount;
        }
        let groupsArray = [];
        this.eventMembers = [...this.eventMembers, ...JSON.parse(JSON.stringify(resp.invitations))];
        if (!searchTerm) {
          this.eventMembersMasterData = [...this.eventMembers];
        }
      }
      if (this.eventMembers.length <= 0) {
        this.noEventMembers = true;
        if (searchTerm) {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Members not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Members for this event' });
        }

      } else {
        this.noEventMembers = false;
      }
      this.showSkeliton = false;
      this.passData(this.eventMembers);
    });
  }

  getacceptedInvitations(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.acceptedInvitations = [];
        endPoint = `event/${this._event.id}/members?status=accepted&pageNo=${this.acceptedInvitationsPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.id}/members?status=accepted&pageNo=${this.acceptedInvitationsPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.acceptedInvitations = [];
        endPoint = `event/${this._event.id}/members?name=${this.searchTerm}&status=accepted&pageNo=${this.acceptedInvitationsSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.id}/members?name=${this.searchTerm}&status=accepted&pageNo=${this.acceptedInvitationsSearchPageNumber}&pageSize=20`;
      }
    }
    this.showSkeliton = true;
    this.noacceptedInvitations = false;
    this.userEventsService.getInvitedMembersList(endPoint).subscribe(resp => {
      if (resp) {
        if (!searchTerm) {
          this.acceptedInvitationsTotalCount = resp.totalCount;
        } else {
          this.acceptedInvitationsSearchTotalCount = resp.totalCount;
        }

        this.acceptedInvitations = [...this.acceptedInvitations, ...JSON.parse(JSON.stringify(resp.invitations))];
        if (!searchTerm) {
          this.acceptedInvitationsMasterData = [...this.acceptedInvitations];
        }
      }
      if (this.acceptedInvitations.length <= 0) {
        this.noacceptedInvitations = true;
        if (searchTerm) {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Results not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'There is no members with Accepted status' });
        }

      } else {
        this.noacceptedInvitations = false;
      }
      this.showSkeliton = false;
      this.passData(this.acceptedInvitations);
    });
  }

  getRejectedInvitations(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.rejectedInvitations = [];
        endPoint = `event/${this._event.id}/members?status=rejected&pageNo=${this.rejectedInvitationsPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.id}/members?status=rejected&pageNo=${this.rejectedInvitationsPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.rejectedInvitations = [];
        endPoint = `event/${this._event.id}/members?name=${this.searchTerm}&status=rejected&pageNo=${this.rejectedInvitationsSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.id}/members?name=${this.searchTerm}&status=rejected&pageNo=${this.rejectedInvitationsSearchPageNumber}&pageSize=20`;
      }
    }
    this.showSkeliton = true;
    this.norejectedInvitations = false;
    this.userEventsService.getInvitedMembersList(endPoint).subscribe(resp => {
      if (resp) {
        if (!searchTerm) {
          this.rejectedInvitationsTotalCount = resp.totalCount;
        } else {
          this.rejectedInvitationsSearchTotalCount = resp.totalCount;
        }

        this.rejectedInvitations = [...this.rejectedInvitations, ...JSON.parse(JSON.stringify(resp.invitations))];
        if (!searchTerm) {
          this.rejectedInvitationsMasterData = [...this.rejectedInvitations];
        }
      }
      if (this.rejectedInvitations.length <= 0) {
        this.norejectedInvitations = true;
        if (searchTerm) {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Results not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'There is no members with Rejected status' });
        }

      } else {
        this.norejectedInvitations = false;
      }
      this.showSkeliton = false;
      this.passData(this.rejectedInvitations);
    });
  }

  getTentativeInvitations(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.acceptedInvitations = [];
        endPoint = `event/${this._event.id}/members?status=tentative&pageNo=${this.acceptedInvitationsPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.id}/members?status=tentative&pageNo=${this.acceptedInvitationsPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.acceptedInvitations = [];
        endPoint = `event/${this._event.id}/members?name=${this.searchTerm}&status=tentative&pageNo=${this.acceptedInvitationsSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `event/${this._event.id}/members?name=${this.searchTerm}&status=tentative&pageNo=${this.acceptedInvitationsSearchPageNumber}&pageSize=20`;
      }
    }
    this.showSkeliton = true;
    this.notentativeInvitations = false;
    this.userEventsService.getInvitedMembersList(endPoint).subscribe(resp => {
      if (resp) {
        if (!searchTerm) {
          this.acceptedInvitationsTotalCount = resp.totalMembersCount;
        } else {
          this.acceptedInvitationsSearchTotalCount = resp.totalMembersCount;
        }

        this.acceptedInvitations = [...this.acceptedInvitations, ...JSON.parse(JSON.stringify(resp.invitations))];
        if (!searchTerm) {
          this.acceptedInvitationsMasterData = [...this.acceptedInvitations];
        }
      }
      if (this.acceptedInvitations.length <= 0) {
        this.notentativeInvitations = true;
        if (searchTerm) {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Results not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'There is no members with Tentative status' });
        }

      } else {
        this.notentativeInvitations = false;
      }
      this.showSkeliton = false;
      this.passData(this.tentativeInvitations);
    });
  }

  deleteInviteeFromMyEvents(member, memberItemIndex) {
    let endPoint = `event/${this._event.id}/invite/${member.inviteeProfileId}`;
    this.userEventsService.deleteInviteeFromMyEvents(endPoint).subscribe(resp => {
      this.membersArrayData.splice(memberItemIndex, 1);
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Invitee removed from this event' });
    });
  }

  addCohostToPrivateEvent(member, memberItemIndex) {
    let endPoint = `event/${this._event.id}/${member.inviteeProfileId}/HostAccess`;
    this.userEventsService.addCoHostToPrivateEvents(endPoint).subscribe(resp => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Co-Host Access given' });
      member.memberType = 'Cohost';
    });
  }

  deleteCohostToPrivateEvent(member, memberItemIndex) {
    let endPoint = `event/${this._event.id}/${member.inviteeProfileId}/HostAccess`;
    this.userEventsService.deleteCoHostToPrivateEvents(endPoint).subscribe(resp => {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Co-Host access removed' });
    member.memberType = 'Invitee';
    });
  }

  confirmRemoveMemberDialog(actionLabel, member, memberItemIndex?) {
    // if (actionLabel == 'Remove from Group') {
    //   this.confirmationService.confirm({
    //     message: `Do you want to remove ${member.profileName + " "} from this Group?`,
    //     header: 'Confirmation',
    //     icon: 'pi pi-info-circle',
    //     accept: () => {
    //       this.removeMembersFromGroup(member, memberItemIndex);
    //     },
    //     reject: () => {
    //     }
    //   });
    // }
  }
  
  inviteToEvent() {
    this.inviteToEventClicked.emit();
  }


}
