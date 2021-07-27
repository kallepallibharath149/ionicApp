import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { groups, groupsActions, groupsListResponse, invitedMembers, members, searchMember } from '../../groups/groups.model';
import { GroupsService } from '../../groups/groups.service';
import anime from 'animejs/lib/anime.es.js';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator'
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { HttpService } from '../../interceptors/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { filesBaseURL } from '../../common/global.constants';
import { ConnectionsService } from '../../services/connections.service';

@Component({
  selector: 'app-groupspreview',
  templateUrl: './groupspreview.component.html',
  styleUrls: ['./groupspreview.component.less']
})
export class GroupspreviewComponent implements OnInit, OnDestroy {
  filesBaseURL: string = '';
  //name generator config start
  customConfig: Config = {
    dictionaries: [adjectives, colors],
    separator: '-',
    length: 2,
  };

  //name generator config end
  currentGroupId: string = '';
  modalReference: any = '';
  group: groups;
  @ViewChild('deleteGroupConfirmation') deleteGroupConfirmation;

  @ViewChild('approveGroupRequests') approveGroupRequests;
  @ViewChild('inviteToGroup') inviteToGroup;

  @ViewChild('defaultGroup') defaultGroup;
  @ViewChild('groupInfo') groupInfo;

  groupInvitations: Array<invitedMembers> = [];
  groupInvitationsCount: number = 0;
  selectedInvitedMembers: Array<invitedMembers> = [];

  friendsArray: Array<any> = [];
  emptyMessage: string = ' ';

  selectedFriends: Array<members> = [];
  filteredFriendsMultiple: Array<searchMember | members> = [];

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
  loadingItems: Array<any> = [1, 2, 3, 4];
  displayInvite: boolean = false;
  groupInfoModalOpened:boolean = false;

  actionItems: Array<groupsActions> = [
    {
      "label": 'Group Info',
      "show": false,
      "showTo": ["admin", "mainadmin", "member"]
    },
    // {
    //   "label": 'Group members',
    //   "show": false,
    //   "showTo": ["admin", "mainadmin", "member"]
    // },
    // {
    //   "label": 'Remove from group',
    //   "show": false,
    //   "showTo": ["admin", "mainadmin"]
    // },
    // {
    //   "label": 'Invite to group',
    //   "show": false,
    //   "showTo": ["member", "admin", "mainadmin"]
    // },
    // {
    //   "label": 'Approve group request',
    //   "show": false,
    //   "showTo": ["admin", "mainadmin"]
    // },
    // {
    //   "label": 'Give admin access',
    //   "show": false,
    //   "showTo": ["mainadmin", "admin"]
    // },
    // {
    //   "label": 'Remove admin access',
    //   "show": false,
    //   "showTo": ["mainadmin", "admin"]
    // },
    {
      "label": 'Delete group',
      "show": false,
      "showTo": ["mainadmin"]
    },
    {
      "label": 'Mark as Default Group',
      "show": false,
      "showTo": ["admin", "mainadmin", "member"]
    }
  ]

  memberActionItems: Array<any> = [
    {
      label: 'Invite to Group'
    }
  ];

  constructor(private groupService: GroupsService,
    private modalService: NgbModal,
    private router: Router,
    private connectionsService: ConnectionsService,
    public messageService: MessageService,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer) {
    this.filesBaseURL = filesBaseURL;
  }

  ngOnInit(): void {
    this.group = {
      ...this.groupService.groupPreviewObj
    }
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentGroupId = params.get('groupId');
      this.getGroupDetails('initial');
    });
  }

  ngOnDestroy() {
    this.groupService.clearGroupPreviewObject();
  }

  filterShowActions() {
    if (this.group.memberType.toLowerCase() == 'admin' || this.group.memberType.toLowerCase() == 'mainadmin') {
      this.group.isAdmin = true;
      this.group.isMainAdmin = false;
      if (this.group.memberType == 'mainAdmin') {
        this.group.isMainAdmin = true;
      }
    } else {
      this.group.isAdmin = false;
      this.group.isMainAdmin = false;
    }
    this.actionItems.forEach(action => {
      if (action.showTo.includes(this.group.memberType.toLowerCase())) {
        action.show = true;
      } else {
        action.show = false;
      }
    });
  }

  // NgbModalOptions
  open(content, actionLabel?) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      container: '#test',
      keyboard: false,
      centered: true,
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    };
    if (actionLabel && actionLabel == 'Group Info') {
      let largeModal: NgbModalOptions = {
        size: 'xl',
        centered: false
      }
      ngbModalOptions = { ...ngbModalOptions, ...largeModal };
      this.groupInfoModalOpened = true;
    }

    if (actionLabel && actionLabel == 'Invite to group') {
      let largeModal: NgbModalOptions = {
        centered: false
      }
      ngbModalOptions = { ...ngbModalOptions, ...largeModal };
    }

    this.modalReference = this.modalService.open(content, ngbModalOptions);
    this.modalReference.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
      this.filteredFriendsMultiple = [];
      this.selectedFriends = [];
      this.InvitationComments = '';
      this.selectedInvitedMembers = [];
      if (actionLabel && actionLabel == 'Invite to group') {
        this.clearSearch('', true);
      }
    }, (reason) => {
      this.filteredFriendsMultiple = [];
      this.selectedFriends = [];
      this.InvitationComments = '';
      this.selectedInvitedMembers = [];
      if (actionLabel && actionLabel == 'Invite to group') {
        this.clearSearch('', true);
      }
      if (actionLabel && actionLabel == 'Group Info') {
        this.groupInfoModalOpened = false;
      }
    });
  }

  menuAction(actionItem, index, actionLabel, groupOptionsRef?) {
    if (actionLabel == 'Delete group') {
      this.open(this.deleteGroupConfirmation);
    } if (actionLabel == 'Group Info') {
      this.open(this.groupInfo, actionLabel);
    } else if (actionLabel == 'Invite to group') {
      this.open(this.inviteToGroup, actionLabel);
      if (this.myConnectionsMasterData.length <= 0) {
        this.getMyconnections(true);
      } else {
        this.myConnections = [...this.myConnectionsMasterData];
      }
    } else if (actionLabel == 'Mark as Default Group') {
      this.open(this.defaultGroup);
    }

    //code to hide menu action panel
    if (groupOptionsRef) {
      setTimeout(() => {
        groupOptionsRef.hide();
      }, 10);
    }
  }

  deleteGroup(modal) {
    let endPiont = `Group/${this.currentGroupId}`;
    this.groupService.deleteGroup(endPiont).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Group deleted successfully' });
      modal.dismiss('Cross click');
      this.router.navigate(['testtt/groups']);
    });

  }

  confirmDefaultGroup(modal) {
    let endPoint = `group/DefaultGroup?groupId=${this.group.groupId}`;
    this.groupService.updateGroupDetails(endPoint).subscribe(resp => {
      modal.dismiss('Cross click');
      this.messageService.add({ severity: 'success', summary: 'Default group', detail: 'Updated this group as default group' });
      this.getGroupDetails();
    });
  }

  getGroupDetails(state?) {
    this.groupService.getGroupDetails(`group/${this.currentGroupId}`).subscribe((resp: groupsListResponse) => {
      if (resp && typeof (resp) == "object") {
        let group: groups = {
          groupName: resp.name,
          groupId: resp.id,
          createdById: resp.createdById,
          groupDescription: resp.groupDescription,
          groupImageUrl: resp.groupImageUrl,
          groupCategory: resp.groupCategory == 'Public' ? true : false,
          memberType: resp.groupMemberType,
          defaultGroup: resp.defaultGroup,
          totalAdminsCount: resp.totalAdminsCount,
          totalMembersCount: resp.totalMembersCount,
          members: resp.members,
          admins: resp.admins
        };
        this.group = group;
        this.filterShowActions();
        // if (state && resp.groupMemberType && (resp.groupMemberType.toLowerCase() == 'admin' || resp.groupMemberType.toLowerCase() == 'mainadmin')) {
        //   this.getGroupInvitations();
        // }
      }
    });
  }


  stopPropagation(event) {
    event.stopPropagation();
  }

  navigateBack() {
    this.router.navigate(["/testtt/groups"])
  }

  //invite members to group from my connections logic start

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
        if(searchTerm){
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

  inviteMemberToGroup(member) {
    if(!member.invitationText){
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please provide invitation text' }); 
      return ; 
    }
    let selectedProfiles = [];
    let id = member.whoInvited == 'me' ? member.profileId2 : member.profileId1;
    selectedProfiles.push(id);
    let inviteObj = {
      "InvitationComments": member.invitationText,
      "profileIDs": selectedProfiles
    }
    let endPoint = `group/${this.group.groupId}/invite `;
    this.groupService.inviteToGroup(endPoint, inviteObj).subscribe(resp => {
      member.invited = true;
      member.showModal = false;
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: `Invited to this group successfully` });
    });
  }
  //invite members to group from my connections logic end

  openGroupInfo(modal){
   modal.dismiss('Cross click');
   if(!this.groupInfoModalOpened){
    this.menuAction('', '', 'Group Info', null);
   }
  }

}



 // approveRejectMembers(modal, selectedInvitedMembers: Array<invitedMembers>, approveState: string, approvedFrom?) {
  //   if (selectedInvitedMembers.length > 0) {
  //     let selectedProfiles = [];
  //     selectedInvitedMembers.forEach(member => {
  //       let IsAccepted = false;
  //       if (approveState == 'approve') {
  //         IsAccepted = true;
  //       } else if (approveState == 'reject') {
  //         IsAccepted = false;
  //       }
  //       let profile = {
  //         "profileid": member.profileid,
  //         "IsAccepted": IsAccepted
  //       }
  //       selectedProfiles.push(profile);
  //     });
  //     let endPoint = `group/${this.group.groupId}/invite/adminaction`;
  //     this.groupService.approveRejectInvitations(endPoint, selectedProfiles).subscribe(resp => {
  //       if (approveState == 'approve') {
  //         this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Selected members invitations approved successfully' });
  //       } else if (approveState == 'reject') {
  //         this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Selected members invitations reverted successfully' });
  //       }
  //       if (!approvedFrom) {
  //         modal.dismiss('Cross click');
  //       } else if (approvedFrom) {
  //         let index = this.selectedInvitedMembers.findIndex(member => { return member.profileid == selectedInvitedMembers[0].profileid });
  //         if (index >= 0) {
  //           this.selectedInvitedMembers.splice(index, 1);
  //         }
  //       }
  //       this.getGroupInvitations();
  //     });
  //   }
  // }

 // filterFriendMultiple(query) {
  //   if (this.filteredFriendsMultiple.length <= 0) {
  //     this.filteredFriendsMultiple = [...this.group.members];
  //   } else {
  //     this.filteredFriendsMultiple = [...this.group.members];
  //   }
  // }

  // searchMembers(event) {
  //   if (event.query) {
  //     this.emptyMessage = ' ';
  //     this.filteredFriendsMultiple = [];
  //     this.getMembersToAdd(event);
  //   } else {
  //     this.filteredFriendsMultiple = [...this.filteredFriendsMultiple];
  //   }
  // }




  // getMembersToAdd(event): void {
  //   let endPoint = `User/search?name=${event.query}&pageNumber=1&pagesize=5`
  //   this.groupService.getMembersToAdd(endPoint).subscribe((resp: Array<searchMember>) => {
  //     let filteredProfile = [];
  //     if (resp && Array.isArray(resp) && resp.length > 0) {
  //       resp.forEach(profile => {
  //         let users: members = {
  //           profileName: profile.firstName + ' ' + profile.lastName,
  //           profileId: profile.profileId,
  //           profileImageUrl: profile.profileImageUrl,
  //           profileCoverImageUrl: profile.profileCoverImageUrl
  //         }
  //         let alreadyMember = this.group.members.some(({ profileId: id2 }) => {
  //           return profile.profileId == id2;
  //         });
  //         if (alreadyMember) {
  //           users.isMember = true;
  //         } else {
  //           users.isMember = false;
  //         }
  //         filteredProfile.push(users);
  //         //  filteredProfile = [... this.filteredFriendsMultiple];
  //       });
  //       //  this.filteredFriendsMultiple = [...[]];
  //       this.filteredFriendsMultiple = [...filteredProfile];
  //     } else {
  //       this.emptyMessage = 'No profiles';
  //     }
  //   });
  // }

 // handleFiles(event) {
  //   this.selectedGroupImageUrl = "";
  //   this.selectedGroupImage = event.target.files[0];
  //   this.Bloburl = URL.createObjectURL(this.selectedGroupImage);
  //   this.selectedGroupImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.Bloburl);
  //   this.cd.detectChanges();
  // }

  // removeSelectedImage(event) {
  //   event.stopPropagation();
  //   this.selectedGroupImageUrl = "";
  //   this.selectedGroupImage = null;
  //   URL.revokeObjectURL(this.Bloburl);
  // }

// checkMemberType(members: Array<members> | null, admins: Array<members> | null, createdById?: string): Array<any> | null {
//   let membersArray = (members && members.length > 0) ? members : [];
//   membersArray.forEach(member => {
//     let memberStatus = admins.some(({ profileId: id2 }) => {
//       return member.profileId == id2;
//     });
//     if (memberStatus) {
//       member.isAdmin = true;
//     } else {
//       member.isAdmin = false;
//     }
//     if (member.profileId == createdById) {
//       member.isMainAdmin = true;
//     } else {
//       member.isMainAdmin = false;
//     }
//   });
//   return members;
// }

// animateInvitationCount() {
//   anime({
//     targets: '.ml2',
//     opacity: 0.1,
//     loop: true,
//     easing: 'easeInOutExpo',
//     delay: 1000
//   });
// }

// changeEvent(value, data) {
// }


// addMembersToGroup(modal, selectedFriends: Array<members>) {
  //   if (selectedFriends.length > 0) {
  //     let selectedProfiles = [];
  //     selectedFriends.forEach(member => {
  //       selectedProfiles.push(member.profileId);
  //     });
  //     let endPoint = `group/${this.group.groupId}/GroupMembers`;
  //     this.groupService.addGroupMember(endPoint, selectedProfiles).subscribe(resp => {
  //       modal.dismiss('Cross click');
  //       this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Selected members added to this group successfully' });
  //       this.getGroupDetails();
  //     });
  //   }
  // }

  // updateGroupFields(modal) {
  //   //  this.group = Object.assign ({},this.updateGroupDetails);
  //   let updateGroupsObj = {
  //     "id": this.updateGroupDetails.groupId,
  //     "name": this.updateGroupDetails.groupName,
  //     "groupDescription": this.updateGroupDetails.groupDescription,
  //     "groupCategory": this.updateGroupDetails.groupCategory ? 'Public' : 'Private'
  //   };
  //   let endPoint = `group/?deleteImage=false`;
  //   let body: FormData = new FormData();
  //   if (this.selectedGroupImage) {
  //     body.append('File', this.selectedGroupImage);
  //   }

  //   body.append('Data', JSON.stringify(updateGroupsObj));
  //   this.groupService.updateGroupDetails(endPoint, body).subscribe(resp => {
  //     modal.dismiss('Cross click');
  //     this.cd.detectChanges();
  //     this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Group details updated Successfully' });
  //     this.getGroupDetails();
  //   });
  // }

  // adminAccessSelectFilter(member: members) {
  //   if (member.isAdmin) {
  //     this.selectedFriends.splice(this.selectedFriends.findIndex(item => { item.profileId == member.profileId }), 1);
  //   }
  // }

  // memberSelectFilter(member: members) {
  //   if (member.isMember) {
  //     this.selectedFriends.splice(this.selectedFriends.findIndex(item => { item.profileId == member.profileId }), 1);
  //   }
  // }

  // confirmAdminAccess(modal, selectedFriends: Array<members>) {
  //   if (selectedFriends.length > 0) {
  //     let selectedProfiles = [];
  //     selectedFriends.forEach(member => {
  //       selectedProfiles.push(member.profileId);
  //     });
  //     let endPoint = `group/${this.group.groupId}/GroupAdmins`;
  //     this.groupService.addGroupAdmin(endPoint, selectedProfiles).subscribe(resp => {
  //       modal.dismiss('Cross click');
  //       this.messageService.add({ severity: 'success', summary: 'Admin Access', detail: 'Admin Access given to selected members' });
  //       this.getGroupDetails();
  //     });
  //   }
  // }

  // confirmRemoveAdminAccess(modal, selectedFriends: Array<members>) {
  //   if (selectedFriends.length > 0) {
  //     let selectedProfiles = [];
  //     selectedFriends.forEach(member => {
  //       selectedProfiles.push(member.profileId);
  //     });
  //     let endPoint = `group/${this.group.groupId}/GroupAdmins`;
  //     this.groupService.deleteGroupAdmin(endPoint, selectedProfiles).subscribe(resp => {
  //       modal.dismiss('Cross click');
  //       this.messageService.add({ severity: 'success', summary: 'Admin Access', detail: 'Selected members admin access removed' });
  //       this.getGroupDetails();
  //     });
  //   }
  // }
