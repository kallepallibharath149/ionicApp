import { Component, OnDestroy, OnInit } from '@angular/core';
import { groups, groupsListResponse, invitedMembers } from '../../groups/groups.model';
import { SidebarModule } from 'primeng/sidebar';
import { GroupsService } from '../../groups/groups.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { filesBaseURL } from '../../common/global.constants';
import { GlobalNavigateService } from './../../services/global.navigate.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.less']
})
export class GroupsListComponent implements OnInit, OnDestroy {
  filesBaseURL: string = '';
  searchTerm: string = '';
  authDetailsSubscription: Subscription;
  navigationSubscription:Subscription;
  calledInitialAPIFromEvent:boolean = false;
  loggedInUserDetails: any;

  selectedTab = "all";
  selectedTabIndex:number = 0;

  Tabs:Array<any> = [
    {
      tabName:'All',
       tabRef:'all'
    },
    {
      tabName:'Created by me',
       tabRef:'createdbyme'
    },
    {
      tabName:'Invitations',
       tabRef:'invitations'
    }
  ]

  //create group variables
  showCreateGroupSideBar: boolean = false;
  selecteGroupImage: File;
  selecteGroupImageUrl: any;
  Bloburl: any;
  createGroupClicked: boolean = false;
  newGroupObj = {
    name: '',
    defaultGroup: false,
    groupDescription: '',
    groupCategory: false
  };

  //all groups tab variables
  allGroupsTotalCount: number = 0;
  allGroupsSearchTotalCount: number = 0;
  allGroupsPageNumber: number = 1;
  allGroupsSearchPageNumber: number = 1;
  groupList: Array<groups> = [];
  allGroupListMasterData: Array<groups> = [];
  noAllGroups: boolean = false;

  //groups created by me tab variables
  createdBymeGroupsTotalCount: number = 0;
  createdBymeGroupsSearchTotalCount: number = 0;
  createdBymeGroupsPageNumber: number = 1;
  createdBymeGroupsSearchPageNumber: number = 1;
  createdBymegroupList: Array<groups> = [];
  createdBymeGroupListMasterData: Array<groups> = [];
  noSearchGroups: boolean = false;

  //group invitations tab variables
  invitedGroupsTotalCount: number = 0;
  invitedGroupsSearchTotalCount: number = 0;
  invitedGroupsPageNumber: number = 1;
  invitedGroupsSearchPageNumber: number = 1;
  groupInvitaionList: Array<invitedMembers> = [];
  groupInvitaionListMasterData: Array<invitedMembers> = [];
  noInvitations: boolean = false;

  searchTermResults: boolean = false;
  showLoading: boolean = false;
  contentLoadItems = [1, 2, 3, 4];

  constructor(private groupService: GroupsService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public messageService: MessageService,
    private authService: AuthService,
    private globalNavigateService:GlobalNavigateService) {
    this.filesBaseURL = filesBaseURL;
    this.authDetailsSubscription = this.authService.authDetails.subscribe(authData => {
      if (authData != 'initial') {
        this.loggedInUserDetails = this.authService.getUserDetails();
      }
    });
    this.navigationSubscription = this.globalNavigateService.globalNavigationEvent.subscribe(action =>{
      if(action && action !=null){
        if(action.NAVIGATION_PAGE =='GROUPS'){
          if(action.SHOW_SIDEBAR){
             this.showCreateGroupSideBar = true;
          }
          if(action.ACTIVE_TAB_INDEX >=0){
            this.selectedTabIndex = action.ACTIVE_TAB_INDEX;
            this.selectedTab = this.Tabs[action.ACTIVE_TAB_INDEX].tabRef;
            this.calledInitialAPIFromEvent = true;
            this.changeTab(this.selectedTab,this.selectedTabIndex, true);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    if(!this.calledInitialAPIFromEvent){
      this.changeTab(this.selectedTab,this.selectedTabIndex, true);
      this.calledInitialAPIFromEvent = true;
    }

    // this.getAllGroupDetails(true);
  }

  ngOnDestroy(){
    this.navigationSubscription.unsubscribe();
  }

  getAllGroupDetails(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.groupList = [];
        endPoint = `group/Groups?pageNo=${this.allGroupsPageNumber}&pageSize=50&adminsSize=4&membersSize=5`;
      } else {
        endPoint = `group/Groups?pageNo=${this.allGroupsPageNumber}&pageSize=20&adminsSize=4&membersSize=6`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.groupList = [];
        endPoint = `group/Groups?name=${this.searchTerm}&pageNo=${this.allGroupsSearchPageNumber}&pageSize=50&adminsSize=4&membersSize=5`;
      } else {
        endPoint = `group/Groups?name=${this.searchTerm}&pageNo=${this.allGroupsSearchPageNumber}&pageSize=20&adminsSize=4&membersSize=5`;
      }
    }
    this.showLoading = true;
    this.noAllGroups = false;
    this.groupService.getAllGroups(endPoint).subscribe((resp) => {
      if (resp) {
        if (!searchTerm) {
          this.allGroupsTotalCount = resp.totalCount;
        } else {
          this.allGroupsSearchTotalCount = resp.totalCount;
        }
        let groupsArray = [];
        resp.groups.forEach(groupResp => {
          let group: groups = {
            groupName: groupResp.name,
            groupId: groupResp.id,
            createdById: groupResp.createdById,
            groupDescription: groupResp.groupDescription,
            groupImageUrl: groupResp.groupImageUrl,
            groupCategory: groupResp.groupCategory == 'Public' ? true : false,
            memberType: groupResp.groupMemberType,
            defaultGroup: groupResp.defaultGroup,
            totalAdminsCount: groupResp.totalAdminsCount,
            totalMembersCount: groupResp.totalMembersCount,
            members: groupResp.members,
            admins: groupResp.admins
          };
          groupsArray.push(group);
        });
        this.groupList = [...this.groupList, ...JSON.parse(JSON.stringify(groupsArray))];
        if (!searchTerm) {
          this.allGroupListMasterData = [...this.groupList];
        }
      }
      if (this.groupList.length <= 0) {
        this.noAllGroups = true;
        if (searchTerm) {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Groups not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Groups Found' });
        }
     
      } else {
        this.noAllGroups = false;
      }
      this.showLoading = false;
    });
  }

  getGroupsCreatedByME(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.createdBymegroupList = [];
        endPoint = `group/mycreatedgroups?pageNo=${this.createdBymeGroupsPageNumber}&pageSize=50&adminsSize=4&membersSize=5`;
      } else {
        endPoint = `group/mycreatedgroups?pageNo=${this.createdBymeGroupsPageNumber}&pageSize=20&adminsSize=4&membersSize=6`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.createdBymegroupList = [];
        endPoint = `group/mycreatedgroups?name=${this.searchTerm}&pageNo=${this.createdBymeGroupsSearchPageNumber}&pageSize=50&adminsSize=4&membersSize=5`;
      } else {
        endPoint = `group/mycreatedgroups?name=${this.searchTerm}&pageNo=${this.createdBymeGroupsSearchPageNumber}&pageSize=20&adminsSize=4&membersSize=5`;
      }
    }
    this.showLoading = true;
    this.noSearchGroups = false;
    this.groupService.getGroupsCreatedByme(endPoint).subscribe((resp) => {
      if (resp) {
        if (!searchTerm) {
          this.createdBymeGroupsTotalCount = resp.totalCount;
        } else {
          this.createdBymeGroupsSearchPageNumber = resp.totalCount;
        }
        let groupsArray = [];
        resp.groups.forEach(groupResp => {
          let group: groups = {
            groupName: groupResp.name,
            groupId: groupResp.id,
            createdById: groupResp.createdById,
            groupDescription: groupResp.groupDescription,
            groupImageUrl: groupResp.groupImageUrl,
            groupCategory: groupResp.groupCategory == 'Public' ? true : false,
            memberType: groupResp.groupMemberType,
            defaultGroup: groupResp.defaultGroup,
            totalAdminsCount: groupResp.totalAdminsCount,
            totalMembersCount: groupResp.totalMembersCount,
            members: groupResp.members,
            admins: groupResp.admins
          };
          groupsArray.push(group);
        });
        this.createdBymegroupList = [...this.createdBymegroupList, ...JSON.parse(JSON.stringify(groupsArray))];
        if (!searchTerm) {
          this.createdBymeGroupListMasterData = [...this.createdBymegroupList];
        }
      }
      if (this.createdBymegroupList.length <= 0) {
        this.noSearchGroups = true;
        if(searchTerm){
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Groups not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No Groups Found' });
        }
     
      } else {
        this.noSearchGroups = false;
      }
      this.showLoading = false;
    });
  }

  getMyGroupInvitations(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.groupInvitaionList = [];
        endPoint = `user/invitedGroups?pageNo=${this.invitedGroupsPageNumber}&pageSize=50`;
      } else {
        endPoint = `group/mycreatedgroups?pageNo=${this.invitedGroupsPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.groupInvitaionList = [];
        endPoint = `user/invitedGroups?pageNo=${this.invitedGroupsSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `user/invitedGroups?pageNo=${this.invitedGroupsSearchPageNumber}&pageSize=20`;
      }
    }
    this.showLoading = true;
    this.noInvitations = false;
    this.groupService.getMyGroupInvitations(endPoint).subscribe((resp: any) => {
      if (resp) {
        if (!searchTerm) {
          this.invitedGroupsTotalCount = resp.totalMembersCount;
        } else {
          this.invitedGroupsSearchTotalCount = resp.totalMembersCount;
        }
        this.groupInvitaionList = [...this.groupInvitaionList, ...JSON.parse(JSON.stringify(resp.invitations))];
        if (!searchTerm) {
          this.groupInvitaionListMasterData = [...this.groupInvitaionList];
        }
      }
      if (this.groupInvitaionList.length <= 0) {
        this.noInvitations = true;
        if(searchTerm){
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: `Group Invitations not found with given search criteria` });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: `You don't have any group invitations` });
        }
       
      } else {
        this.noInvitations = false;
      }
      this.showLoading = false;
    });
  }

  changeTab(tabName: string,tabIndex, initialCall?) {
    if(this.selectedTab !=tabName || initialCall){
      this.selectedTab = tabName;
      this.searchTerm = '';
      this.selectedTabIndex = tabIndex;
      if (tabName == 'all') {
        this.noAllGroups = false;
        if (this.searchTermResults) {
          this.allGroupsSearchPageNumber = 1;
          this.allGroupsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        if (this.allGroupListMasterData.length > 0) {
          this.groupList = [...this.allGroupListMasterData];
        } else {
          this.allGroupsTotalCount = 0;
          this.allGroupsPageNumber = 1;
          this.getAllGroupDetails(true);
        }
      } else if (tabName == 'createdbyme') {
        if (this.searchTermResults) {
          this.createdBymeGroupsSearchPageNumber = 1;
          this.createdBymeGroupsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noSearchGroups = false;
        if (this.createdBymeGroupListMasterData.length > 0) {
          this.createdBymegroupList = [...this.createdBymeGroupListMasterData];
        } else {
          this.createdBymeGroupsTotalCount = 0;
          this.createdBymeGroupsPageNumber = 1;
          this.getGroupsCreatedByME(true);
        }
      } else if (tabName == 'invitations') {
        if (this.searchTermResults) {
          this.invitedGroupsSearchPageNumber = 1;
          this.invitedGroupsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noInvitations = false;
        if (this.groupInvitaionListMasterData.length > 0) {
          this.groupInvitaionList = [...this.groupInvitaionListMasterData];
        } else {
          this.invitedGroupsTotalCount = 0;
          this.invitedGroupsPageNumber = 1;
          this.getMyGroupInvitations(true);
        }
      }
    }
  }

  filterBySearch(selectedTab, searchTerm) {
    let term = searchTerm ? searchTerm.toLowerCase() : '';
    if (selectedTab == 'all') {
      if (term) {
        this.groupList = [];
        this.allGroupsSearchTotalCount = 0;
        this.allGroupsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getAllGroupDetails(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    } else if (selectedTab == 'createdbyme') {
      if (term) {
        this.createdBymegroupList = [];
        this.createdBymeGroupsSearchTotalCount = 0;
        this.createdBymeGroupsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getGroupsCreatedByME(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    } else if (selectedTab == 'invitations') {
      if (term) {
        this.groupInvitaionList = [];
        this.invitedGroupsSearchTotalCount = 0;
        this.invitedGroupsSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getMyGroupInvitations(true, true);
      } else {
        // nothing to do because no search criteria provided
      }
    }
  }

  clearSearch(selectedTab, searchTerm) {
    this.searchTerm = '';
    if (selectedTab == 'all') {
      if (this.searchTermResults && this.allGroupListMasterData.length > 0) {
        this.allGroupsSearchTotalCount = 0;
        this.allGroupsSearchPageNumber = 1;
        this.searchTermResults = false;
        this.noAllGroups = false;
        this.groupList = [...this.allGroupListMasterData];
      } else {
        this.searchTermResults = false;
        this.allGroupsTotalCount = 0;
        this.allGroupsPageNumber = 1;
        this.noAllGroups = true;
        // if (!this.noAllGroups) {
        //   this.getAllGroupDetails(true);
        // }
      }
    } else if (selectedTab == 'createdbyme') {
      if (this.searchTermResults && this.createdBymeGroupListMasterData.length > 0) {
        this.createdBymeGroupsSearchTotalCount = 0;
        this.createdBymeGroupsSearchPageNumber = 1;
        this.searchTermResults = false;
        this.noSearchGroups = false;
        this.createdBymegroupList = [...this.createdBymeGroupListMasterData];
      } else {
        this.searchTermResults = false;
        this.createdBymeGroupsTotalCount = 0;
        this.createdBymeGroupsPageNumber = 1;
        this.noSearchGroups = true;
        // if (!this.noSearchGroups) {
        //   this.getGroupsCreatedByME(true);
        // }
      }

    } else if (selectedTab == 'invitations') {
      if (this.searchTermResults && this.groupInvitaionListMasterData.length > 0) {
        this.invitedGroupsSearchTotalCount = 0;
        this.invitedGroupsSearchPageNumber = 1;
        this.searchTermResults = false;
        this.noInvitations = false;
        this.groupInvitaionList = [...this.groupInvitaionListMasterData];
      } else {
        this.searchTermResults = false;
        this.invitedGroupsTotalCount = 0;
        this.invitedGroupsPageNumber = 1;
        this.noInvitations = true;
      }

    }
  }

  navigateToGroupPreview(group: groups) {
    this.groupService.setGroupPreviewObject(group);
    this.router.navigate(["/testtt/groups/preview", group.groupId]);
  }

  creteNewGroup(newGrouPForm: NgForm) {
    let payLoad: any = Object.assign({}, this.newGroupObj);
    payLoad.groupCategory = payLoad.groupCategory ? 'Public' : 'Private';
    let body: FormData = new FormData();
    body.append('files', this.selecteGroupImage);
    body.append('Data', JSON.stringify(payLoad));
    let endPoint = 'group';
    this.createGroupClicked = true;
    this.groupService.createGroup(endPoint, body).subscribe(resp => {
      this.createGroupClicked = false;
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Group created successfully' });
      
      this.allGroupsTotalCount = 0;
      this.allGroupsPageNumber = 1;
      this.getAllGroupDetails(true);

      this.createdBymeGroupsTotalCount = 0;
      this.createdBymeGroupsPageNumber = 1;
      this.getGroupsCreatedByME(true);
      this.sideBarHide(newGrouPForm);

    }, (error) => {
      this.createGroupClicked = false;
    });
  }

  handleFiles(event) {
    this.selecteGroupImageUrl = "";
    this.selecteGroupImage = event.target.files[0];
    this.Bloburl = URL.createObjectURL(this.selecteGroupImage);
    this.selecteGroupImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.Bloburl);
  }

  selectGroupImage(groupImageRef: HTMLElement) {
    groupImageRef.click();
  }

  removeSelectedImage(event) {
    event.stopPropagation();
    this.selecteGroupImageUrl = "";
    URL.revokeObjectURL(this.Bloburl);
  }

  sideBarHide(newGrouPForm: NgForm) {
    newGrouPForm.reset();
    this.selecteGroupImageUrl = "";
    URL.revokeObjectURL(this.Bloburl);
    this.showCreateGroupSideBar = false;
  }

  acceptMyGroupInvitation(invitationObj: any) {
    let endPoint = `group/${invitationObj.groupid}/invite/inviteeaction?isAccepted=true`;
    this.groupService.approveRejectMyInvitations(endPoint).subscribe(resp => {
      invitationObj.accepted = 'accepted';
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'You accepted invitation.Now you are part of this group' });
    });
  }

  rejectMyGroupInvitation(invitationObj: any) {
    let endPoint = `group/${invitationObj.groupid}/invite/inviteeaction?isAccepted=false`;
    this.groupService.approveRejectMyInvitations(endPoint).subscribe(resp => {
      invitationObj.accepted = 'rejected';
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'You rejected this group invitation. You are not part of this group' });
    });
  }


  lazyLoadCreatedByMe() {
    if (this.searchTermResults) {
      if (this.createdBymegroupList.length < this.createdBymeGroupsSearchTotalCount && (this.createdBymeGroupsSearchTotalCount != 0)) {
        this.createdBymeGroupsSearchPageNumber = this.createdBymeGroupsSearchPageNumber + 1;
        this.getGroupsCreatedByME(false, true);
      }
    } else {
      if (this.createdBymegroupList.length < this.createdBymeGroupsTotalCount && (this.createdBymeGroupsTotalCount != 0)) {
        this.createdBymeGroupsPageNumber = this.createdBymeGroupsPageNumber + 1;
        this.getGroupsCreatedByME(false);
      }
    }
  }

  lazyLoadInvitations() {
    if (this.searchTermResults) {
      if (this.groupInvitaionList.length < this.invitedGroupsSearchTotalCount && (this.invitedGroupsSearchTotalCount != 0)) {
        this.invitedGroupsSearchPageNumber = this.invitedGroupsSearchPageNumber + 1;
        this.getMyGroupInvitations(false, true);
      }
    } else {
      if (this.groupInvitaionList.length < this.invitedGroupsTotalCount && (this.invitedGroupsTotalCount != 0)) {
        this.invitedGroupsPageNumber = this.invitedGroupsPageNumber + 1;
        this.getMyGroupInvitations(false);
      }
    }
  }

  lazyLoadAllGroups() {
    if (this.searchTermResults) {
      if (this.groupList.length < this.allGroupsSearchTotalCount && (this.allGroupsSearchTotalCount != 0)) {
        this.allGroupsSearchPageNumber = this.allGroupsSearchPageNumber + 1;
        this.getAllGroupDetails(false, true);
      }
    } else {
      if (this.groupList.length < this.allGroupsTotalCount && (this.allGroupsTotalCount != 0)) {
        this.allGroupsPageNumber = this.allGroupsPageNumber + 1;
        this.getAllGroupDetails(false);
      }
    }
  }

  groupsSearch(searchTerm){
    if(!searchTerm){
      this.clearSearch(this.selectedTab, searchTerm)
    }
  }

}
