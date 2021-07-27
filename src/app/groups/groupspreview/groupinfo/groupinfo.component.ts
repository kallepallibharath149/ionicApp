import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { GroupsService } from '../../../groups/groups.service';
import { groups } from '../../../groups/groups.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService, ConfirmationService } from 'primeng/api';
import { filesBaseURL } from './../../../common/global.constants';
import { DomSanitizer } from '@angular/platform-browser';
import {PrimeIcons} from 'primeng/api';

@Component({
  selector: 'app-groupinfo',
  templateUrl: './groupinfo.component.html',
  styleUrls: ['./groupinfo.component.less'],
  providers: [ConfirmationService]
})
export class GroupinfoComponent implements OnInit {

  @Output('inviteGroupClicked') inviteGroupClicked: EventEmitter<any> = new EventEmitter();
  @Output('callGetGroupDetails') callGetGroupDetails: EventEmitter<any> = new EventEmitter();
  activeTabIndex: number = 0;
  activeTabName: string = 'Group info';
  filesBaseURL: any = '';

  //group info variables
  @ViewChild('groupImageRef') groupImageRef: ElementRef;
  public _group: groups;
  public _groupCopy: groups;
  @ViewChild('groupScroll') groupScroll: ElementRef;
  @ViewChild('inlineEdit1', { static: false }) inlineEdit1;
  @ViewChild('inlineEdit2', { static: false }) inlineEdit2;
  @ViewChild('inlineEdit3', { static: false }) inlineEdit3;
  @Input('group') set group(value: groups) {
    this._group = JSON.parse(JSON.stringify(value));
    if (!this.groupDetailsEdit) {
      this._groupCopy = JSON.parse(JSON.stringify(value));
    }
  };
  selecteGroupImage: File;
  selecteGroupImageUrl: any;
  Bloburl: any;
  groupDetailsEdit: boolean = false;

  //groupmembers tab variables
  groupMembersTotalCount: number = 0;
  groupMembersSearchTotalCount: number = 0;
  groupMembersPageNumber: number = 1;
  groupMembersSearchPageNumber: number = 1;
  groupMembers: Array<any> = [];
  groupMembersMasterData: Array<any> = [];
  noGroupMembers: boolean = false;

  //pending invitations variables
  pendingInvitationsTotalCount: number = 0;
  pendingInvitationsSearchTotalCount: number = 0;
  pendingInvitationsPageNumber: number = 1;
  pendingInvitationsSearchPageNumber: number = 1;
  pendingInvitations: Array<any> = [];
  pendingInvitationsMasterData: Array<any> = [];
  noPendingInvitations: boolean = false;

  //pending invitations variables
  sentInvitationsTotalCount: number = 0;
  sentInvitationsSearchTotalCount: number = 0;
  sentInvitationsPageNumber: number = 1;
  sentInvitationsSearchPageNumber: number = 1;
  sentInvitations: Array<any> = [];
  sentInvitationsMasterData: Array<any> = [];
  noSentInvitations: boolean = false;

  members: Array<any> = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ];


  searchTermResults: boolean = false;
  @Input('modalRef') modalRef: any;
  searchTerm: any = '';
  showSkeliton: boolean = false;



 timelineObj={invitedBy: false, profileName: '', invitationSentTime: null, profileImageUrl:''};

  loadingItems = [1, 2, 3, 4, 5];



  groupPageNumber: number = 1;
  infoTabs: Array<any> = [
    {
      label: 'Group info'
    },
    {
      label: 'Group Members'
    },
    {
      label: 'Pending Invitations'
    },
    {
      label: 'Sent Invitations'
    }
  ];

  imageActions: Array<any> = [
    {
      label: 'Upload Group Image'
    },
    {
      label: 'Update Group Image'
    },
    {
      label: 'Delete Group Image'
    },
    {
      label: 'Cancel'
    }
  ]

  memberActionItems: Array<any> = [
    {
      label: 'Give Admin Access'
    },
    {
      label: 'Remove Admin Access'
    },
    {
      label: 'Remove from Group'
    },
    {
      label: 'Member info'
    }
  ];

  constructor(private groupService: GroupsService,
    private modalService: NgbModal,
    public messageService: MessageService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService) {
    this.filesBaseURL = filesBaseURL;
  }

  ngOnInit(): void {
  }

  lazyLoad() {
    if (this.activeTabIndex != 0) {
      if (this.activeTabName == 'Group Members') {
        if (this.searchTermResults) {
          if (this.groupMembers.length < this.groupMembersSearchTotalCount && (this.groupMembersSearchTotalCount != 0)) {
            this.groupMembersSearchPageNumber = this.groupMembersSearchPageNumber + 1;
            this.getGroupMembers(false, true);
          }
        } else {
          if (this.groupMembers.length < this.groupMembersTotalCount && (this.groupMembersTotalCount != 0)) {
            this.groupMembersPageNumber = this.groupMembersPageNumber + 1;
            this.getGroupMembers(false);
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
  }

  groupMembersActions(actionLabel, member, memberItemIndex?) {
    if (actionLabel == 'Give Admin Access') {
      this.giveAdminAccess(member);
    } else if (actionLabel == 'Remove Admin Access') {
      this.removeAdminAccess(member);
    } else if (actionLabel == 'Remove from Group') {
      this.confirmRemoveMemberDialog('Remove from Group', member, memberItemIndex)
    } else if (actionLabel == 'Member info') {

    }

  }

  searchPeople(searchTerm) {
    // alert();
  }

  tabClick(tabIndex, Tablabel) {
    if (tabIndex != this.activeTabIndex) {
      if (this.activeTabIndex == 0 && (this.selecteGroupImageUrl || this.groupDetailsEdit)) {
        this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'There are unsaved changes.Please Save' });
        return;
      }
      this.searchTerm = '';
      let element = this.groupScroll.nativeElement;
      element.scrollTop = 0;
      this.activeTabIndex = tabIndex;
      this.activeTabName = Tablabel;
      this.showSkeliton = false;
      if (Tablabel == 'Group info') {

      } else if (Tablabel == 'Group Members') {
        if (this.searchTermResults) {
          this.groupMembersSearchPageNumber = 1;
          this.groupMembersSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noGroupMembers = false;
        if (this.groupMembersMasterData.length > 0) {
          this.groupMembers = [...this.groupMembersMasterData];
        } else {
          this.groupMembersTotalCount = 0;
          this.groupMembersPageNumber = 1;
          this.getGroupMembers(true);
        }
      } else if (Tablabel == 'Pending Invitations') {
        if (this.searchTermResults) {
          this.pendingInvitationsSearchPageNumber = 1;
          this.pendingInvitationsSearchTotalCount = 0;
          this.searchTermResults = false;
        }
        this.noPendingInvitations = false;
        if (this.pendingInvitationsMasterData.length > 0) {
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
        if (this.sentInvitationsMasterData.length > 0) {
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
    if (selectedTab == 'Group Members') {
      if (term) {
        this.groupMembers = [];
        this.groupMembersSearchTotalCount = 0;
        this.groupMembersSearchPageNumber = 1;
        this.searchTermResults = true;
        this.getGroupMembers(true, true);
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
    if (selectedTab == 'Group Members') {
      if (this.searchTermResults && this.groupMembersMasterData.length > 0) {
        this.groupMembersSearchTotalCount = 0;
        this.groupMembersSearchPageNumber = 1;
        this.searchTermResults = false;
        this.noGroupMembers = false;
        this.groupMembers = [...this.groupMembersMasterData];
      } else {
        this.searchTermResults = false;
        this.groupMembersTotalCount = 0;
        this.groupMembersPageNumber = 1;
        this.noGroupMembers = true;
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

  getGroupMembers(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.groupMembers = [];
        endPoint = `group/${this._group.groupId}/groupmembers/search?pageNo=${this.groupMembersPageNumber}&pageSize=50`;
      } else {
        endPoint = `group/${this._group.groupId}/groupmembers/search?pageNo=${this.groupMembersPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.groupMembers = [];
        endPoint = `group/${this._group.groupId}/groupmembers/search?name=${this.searchTerm}&pageNo=${this.groupMembersSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `group/${this._group.groupId}/groupmembers/search?name=${this.searchTerm}&pageNo=${this.groupMembersSearchPageNumber}&pageSize=20`;
      }
    }
    this.showSkeliton = true;
    this.noGroupMembers = false;
    this.groupService.getGroupMembers(endPoint).subscribe(resp => {
      if (resp) {
        if (!searchTerm) {
          this.groupMembersTotalCount = resp.totalMembersCount;
        } else {
          this.groupMembersSearchTotalCount = resp.totalMembersCount;
        }
        let groupsArray = [];
        this.groupMembers = [...this.groupMembers, ...JSON.parse(JSON.stringify(resp.members))];
        if (!searchTerm) {
          this.groupMembersMasterData = [...this.groupMembers];
        }
      }
      if (this.groupMembers.length <= 0) {
        this.noGroupMembers = true;
        if(searchTerm){
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Group members not found with given search criteria'});
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'No group members' });
        }
       
      } else {
        this.noGroupMembers = false;
      }
      this.showSkeliton = false;
    });
  }

  getPendingInvitations(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.pendingInvitations = [];
        endPoint = `group/${this._group.groupId}/groupmembers/pending?pageNo=${this.pendingInvitationsPageNumber}&pageSize=50`;
      } else {
        endPoint = `group/${this._group.groupId}/groupmembers/pending?pageNo=${this.pendingInvitationsPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.pendingInvitations = [];
        endPoint = `group/${this._group.groupId}/groupmembers/pending?name=${this.searchTerm}&pageNo=${this.pendingInvitationsSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `group/${this._group.groupId}/groupmembers/pending?name=${this.searchTerm}&pageNo=${this.pendingInvitationsSearchPageNumber}&pageSize=20`;
      }
    }
    this.showSkeliton = true;
    this.noPendingInvitations = false;
    this.groupService.getGroupInvitations(endPoint).subscribe(resp => {
      if (resp) {
        if (!searchTerm) {
          this.pendingInvitationsTotalCount = resp.totalMembersCount;
        } else {
          this.pendingInvitationsSearchTotalCount = resp.totalMembersCount;
        }

        resp.invitations.forEach(invitation => {
          let timelineArray = [];
          for(let i=0;i<2;i++){
            let timeLine = Object.assign({}, this.timelineObj);
            if(i==0){
              timeLine.invitationSentTime = invitation.invitationSentTime;
              timeLine.profileName = invitation.invitedByProfileName;
              timeLine.profileImageUrl = invitation.invitedbyProfileImageUrl;
              timeLine.invitedBy =true;
            }
            if(i==1){
              timeLine.profileName = invitation.profileName;
              timeLine.profileImageUrl = invitation.profileImageUrl;
              timeLine.invitedBy =false;  
            }
            timelineArray.push(timeLine);
          }
          invitation.timeLine = timelineArray;
        });
        this.pendingInvitations = [...this.pendingInvitations, ...JSON.parse(JSON.stringify(resp.invitations))];
        // for(let i=0; i<20;i++){
        // let data = JSON.parse(JSON.stringify(this.pendingInvitations));
        // this.pendingInvitations = [...this.pendingInvitations, ...data];
        // }
        if (!searchTerm) {
          this.pendingInvitationsMasterData = [...this.pendingInvitations];
        }
      }
      if (this.pendingInvitations.length <= 0) {
        this.noPendingInvitations = true;
        if(searchTerm){
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Pending Invitations not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'There is no pending invitations' });
        }
       
      } else {
        this.noPendingInvitations = false;
      }
      this.showSkeliton = false;
    });
  }


  getSentInvitations(initialState?, searchTerm?) {
    let endPoint = '';
    if (!searchTerm) {// executing when there is no search criteria
      if (initialState) {
        this.sentInvitations = [];
        endPoint = `group/${this._group.groupId}/groupmembers/sentinvitations?pageNo=${this.sentInvitationsPageNumber}&pageSize=50`;
      } else {
        endPoint = `group/${this._group.groupId}/groupmembers/sentinvitations?pageNo=${this.sentInvitationsPageNumber}&pageSize=20`;
      }
    } else {// executing when there is search criteria
      if (initialState) {
        this.sentInvitations = [];
        endPoint = `group/${this._group.groupId}/groupmembers/sentinvitations?name=${this.searchTerm}&pageNo=${this.sentInvitationsSearchPageNumber}&pageSize=50`;
      } else {
        endPoint = `group/${this._group.groupId}/groupmembers/sentinvitations?name=${this.searchTerm}&pageNo=${this.sentInvitationsSearchPageNumber}&pageSize=20`;
      }
    }
    this.showSkeliton = true;
    this.noSentInvitations = false;
    this.groupService.getGroupInvitations(endPoint).subscribe(resp => {
      if (resp) {
        if (!searchTerm) {
          this.sentInvitationsTotalCount = resp.totalMembersCount;
        } else {
          this.sentInvitationsSearchTotalCount = resp.totalMembersCount;
        }
        resp.invitations.forEach(invitation => {
          let timelineArray = [];
          for(let i=0;i<2;i++){
            let timeLine = Object.assign({}, this.timelineObj);
            if(i==0){
              timeLine.invitationSentTime = invitation.invitationSentTime;
              timeLine.profileName = invitation.invitedByProfileName;
              timeLine.profileImageUrl = invitation.invitedbyProfileImageUrl;
              timeLine.invitedBy =true;
            }
            if(i==1){
              timeLine.profileName = invitation.profileName;
              timeLine.profileImageUrl = invitation.profileImageUrl;
              timeLine.invitedBy =false;  
            }
            timelineArray.push(timeLine);
          }
          invitation.timeLine = timelineArray;
        });
        this.sentInvitations = [...this.sentInvitations, ...JSON.parse(JSON.stringify(resp.invitations))];
        if (!searchTerm) {
          this.sentInvitationsMasterData = [...this.sentInvitations];
        }
      }
      if (this.sentInvitations.length <= 0) {
        this.noSentInvitations = true;
        if(searchTerm){
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Sent Invitations not found with given search criteria' });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'There is no sent invitations' });
        }
      
      } else {
        this.noSentInvitations = false;
      }
      this.showSkeliton = false;
    });
  }


  giveAdminAccess(member) {
    if (member) {
      let selectedProfiles = [];
      selectedProfiles.push(member.profileId);
      let endPoint = `group/${this._group.groupId}/GroupAdmins`;
      this.groupService.addGroupAdmin(endPoint, selectedProfiles).subscribe(resp => {
        this.messageService.add({ severity: 'success', summary: 'Admin Access', detail: 'Admin access approved' });
        member.memberType = 'admin';
      });
    }
  }

  removeAdminAccess(member) {
    if (member) {
      let selectedProfiles = [];
      selectedProfiles.push(member.profileId);
      let endPoint = `group/${this._group.groupId}/GroupAdmins`;
      this.groupService.deleteGroupAdmin(endPoint, selectedProfiles).subscribe(resp => {
        this.messageService.add({ severity: 'success', summary: 'Admin Access', detail: 'Admin access removed' });
        member.memberType = 'member';
      });
    }
  }

  confirmRemoveMemberDialog(actionLabel, member, memberItemIndex?) {
    if (actionLabel == 'Remove from Group') {
      this.confirmationService.confirm({
        message: `Do you want to remove ${member.profileName +" "} from this Group?`,
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.removeMembersFromGroup(member, memberItemIndex);
        },
        reject: () => {
        }
      });
    }
  }

  removeMembersFromGroup(member, memberItemIndex?) {
    if (member) {
      let selectedProfiles = [];
      selectedProfiles.push(member.profileId);
      let endPoint = `group/${this._group.groupId}/GroupMembers`;
      this.groupService.removeGroupMember(endPoint, selectedProfiles).subscribe(resp => {
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Member removed from this group successfully' });
        this.groupMembers.splice(memberItemIndex,1);
        this.callGetGroupDetails.emit();
      });
    }
  }

  approveRejectMembers( invitation: any, approveState: string) {
    if (invitation) {
      let selectedProfiles = [];
        let IsAccepted = false;
        if (approveState == 'approve') {
          IsAccepted = true;
        } else if (approveState == 'reject') {
          IsAccepted = false;
        }
        let profile = {
          "profileid": invitation.profileid,
          "IsAccepted": IsAccepted
        }
        selectedProfiles.push(profile);
      let endPoint = `group/${this._group.groupId}/invite/adminaction`;
      this.groupService.approveRejectInvitations(endPoint, selectedProfiles).subscribe(resp => {
        if (approveState == 'approve') {
          invitation.ApproveStatus = 'approved';
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Approved group invitation successfully' });
        } else if (approveState == 'reject') {
          invitation.ApproveStatus = 'rejected';
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Rjected group invitation' });
        }
      });
    }
  }


  groupImageAction(actionLabel) {
    if (actionLabel == 'Upload Group Image' || actionLabel == 'Update Group Image') {
      this.groupImageRef.nativeElement.value = null;
      this.groupImageRef.nativeElement.click();
    } else if (actionLabel == 'Cancel') {
      this.removeSelectedImage()
    } else if (actionLabel == 'Delete Group Image') {
      this.confirmationService.confirm({
        message: 'Do you want to delete Group Image?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.confirmDeleteGroupImage();
        },
        reject: () => {
        }
      });
    }
  }

  handleFiles(event) {
    this.selecteGroupImageUrl = "";
    this.selecteGroupImage = event.target.files[0];
    this.Bloburl = URL.createObjectURL(this.selecteGroupImage);
    this.selecteGroupImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.Bloburl);
  }

  removeSelectedImage() {
    this.selecteGroupImageUrl = "";
    this.selecteGroupImage = null;
    URL.revokeObjectURL(this.Bloburl);
  }

  inviteToGroup() {
    this.inviteGroupClicked.emit();
  }

  editGroupDetails() {
    this.groupDetailsEdit = true;
  }

  cancelGroupEdit(groupImageEdit, groupDetailsEdit) {
    if (groupImageEdit) {
      this.removeSelectedImage();
    }
    if (groupDetailsEdit) {
      this._groupCopy = JSON.parse(JSON.stringify(this._group));
      this.inlineEdit1.deactivate();
      this.inlineEdit2.deactivate();
      this.inlineEdit3.deactivate();
      this.groupDetailsEdit = false;
    }
  }

  confirmDeleteGroupImage() {
    let endPoint = `group/?deleteImage=true`;
    let updateGroupsObj = {
      "id": this._group.groupId,
      "name": this._group.groupName,
      "groupDescription": this._group.groupDescription,
      "groupCategory": this._group.groupCategory ? 'Public' : 'Private'
    };
    let body: FormData = new FormData();
    body.append('Data', JSON.stringify(updateGroupsObj));
    this.groupService.updateGroupDetails(endPoint, body).subscribe(resp => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Group image removed successfully' });
      this.callGetGroupDetails.emit();
    });
  }

  saveGroupChanges() {
    let updateGroupsObj = {
      "id": this._groupCopy.groupId,
      "name": this._groupCopy.groupName,
      "groupDescription": this._groupCopy.groupDescription,
      "groupCategory": this._groupCopy.groupCategory ? 'Public' : 'Private'
    };
    let endPoint = `group/?deleteImage=false`;
    let body: FormData = new FormData();
    if (this.selecteGroupImageUrl) {
      body.append('File', this.selecteGroupImage);
    }
    body.append('Data', JSON.stringify(updateGroupsObj));
    this.groupService.updateGroupDetails(endPoint, body).subscribe(resp => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Group details updated Successfully' });
      this.groupDetailsEdit = false;
      this.removeSelectedImage();
      this.inlineEdit1.deactivate();
      this.inlineEdit2.deactivate();
      this.inlineEdit3.deactivate();
      this.callGetGroupDetails.emit();
    });
  }

}
