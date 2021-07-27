import { Component, OnInit, EventEmitter, ElementRef, Renderer2, ViewChild, OnDestroy, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GlobalEmittingEventsService } from './../../services/global-emitting-events.service';
import { Subscription } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { filesBaseURL } from '../../common/global.constants';
import { NgForm } from '@angular/forms';
import { LoginServiceService } from '../../login/login-service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GlobalNavigateService } from 'src/app/services/global.navigate.service';
import { navigateAction, securityCodeObj, securityCodeResp } from './../../common/models/profile.model';

@Component({
  selector: 'app-account-and-profile',
  templateUrl: './account-and-profile.component.html',
  styleUrls: ['./account-and-profile.component.less']
})
export class AccountAndProfileComponent implements OnInit, OnDestroy {
  @Output('homburgerClicked') homburgerClicked = <any>new EventEmitter();
  loggedInUserDetails: any;
  profileTextLetter: any = '';
  authDetailsSubscription: Subscription;
  showUpdatePasswordModal: boolean = false;
  passwordSecurityCode: securityCodeResp;
  newPasswordObj = {
    newPassword: '',
    newConfirmPassword: '',
    confirmOTP: ''
  }

  notificationsList: Array<any> = [
    // {
    //   "id": "c06d927d-5bde-4f58-af15-c3c36e0b8e10",
    //   "notificationText": "You are invited for new connection by 'one Last'",
    //   "notificationType": "NETWORK_INVITATION"
    // },
    // {
    //   "id": "4f0ef55e-93e8-48d2-8855-e04c90233c65",
    //   "notificationText": " You are invited for new event 'My personal event 8'",
    //   "notificationType": "EVENTS_INVITATION"
    // },
    // {
    //   "id": "f40b9165-91c8-4f08-9be2-c8d8c5a834dd",
    //   "notificationText": "You are invited for new group 'My Main Group 123'",
    //   "notificationType": "GROUPS_INVITATION"
    // },
    // {
    //   "id": "c06d927d-5bde-4f58-af15-c3c36e0b8e10",
    //   "notificationText": "You are invited for new connection by 'one Last'",
    //   "notificationType": "NETWORK_INVITATION"
    // },
    // {
    //   "id": "4f0ef55e-93e8-48d2-8855-e04c90233c65",
    //   "notificationText": " You are invited for new event 'My personal event 8'",
    //   "notificationType": "EVENTS_INVITATION"
    // },
    // {
    //   "id": "f40b9165-91c8-4f08-9be2-c8d8c5a834dd",
    //   "notificationText": "You are invited for new group 'My Main Group 123'",
    //   "notificationType": "GROUPS_INVITATION"
    // },
    // {
    //   "id": "c06d927d-5bde-4f58-af15-c3c36e0b8e10",
    //   "notificationText": "You are invited for new connection by 'one Last'",
    //   "notificationType": "NETWORK_INVITATION"
    // },
    // {
    //   "id": "4f0ef55e-93e8-48d2-8855-e04c90233c65",
    //   "notificationText": " You are invited for new event 'My personal event 8'",
    //   "notificationType": "EVENTS_INVITATION"
    // },
    // {
    //   "id": "f40b9165-91c8-4f08-9be2-c8d8c5a834dd",
    //   "notificationText": "You are invited for new group 'My Main Group 123'",
    //   "notificationType": "GROUPS_INVITATION"
    // },
    // {
    //   "id": "c06d927d-5bde-4f58-af15-c3c36e0b8e10",
    //   "notificationText": "You are invited for new connection by 'one Last'",
    //   "notificationType": "NETWORK_INVITATION"
    // },
    // {
    //   "id": "4f0ef55e-93e8-48d2-8855-e04c90233c65",
    //   "notificationText": " You are invited for new event 'My personal event 8'",
    //   "notificationType": "EVENTS_INVITATION"
    // },
    // {
    //   "id": "f40b9165-91c8-4f08-9be2-c8d8c5a834dd",
    //   "notificationText": "You are invited for new group 'My Main Group 123'",
    //   "notificationType": "GROUPS_INVITATION"
    // }
  ]

  notificationsPageNumber: number = 1;
  notificationsTotalCount: number = 0;
  noNotifiCationsItems: boolean = false;
  notificationLoading: boolean = false;
  reloadingNotifications: boolean = false;

  constructor(private renderer: Renderer2,
    private globalEmitterService: GlobalEmittingEventsService,
    private authService: AuthService,
    private eventService: EventsService,
    private logInservice: LoginServiceService,
    public messageService: MessageService,
    private router: Router,
    private globalNavigate: GlobalNavigateService,
  ) {
    this.authDetailsSubscription = this.authService.authDetails.subscribe(authData => {
      if (authData != 'initial') {
        this.loggedInUserDetails = this.authService.getUserDetails();
        this.profileTextLetter = this.checkProfileFirstLetters(this.loggedInUserDetails);
        if (this.loggedInUserDetails.profileImageUrl) {
          this.loggedInUserDetails.ImageUrl = `${this.loggedInUserDetails.profileImageUrl}`;
        }
      }
    });


  }

  ngOnInit(): void {
    this.getNotifications('initial')
  }


  getNotifications(state, reload?) {
    if (!this.notificationLoading) {
      let endPoint = '';
      if (state == 'initial') {
        this.notificationsList = [];
        this.notificationsPageNumber = 1;
        endPoint = `User/notifications?pageNo=1&pageSize=50`
      } else {
        endPoint = `User/notifications?pageNo=${this.notificationsPageNumber}&pageSize=50`
      }
      this.notificationLoading = true;
      this.authService.getNotifications(endPoint).subscribe(res => {
        this.notificationLoading = false;
        if (reload) {
          this.reloadingNotifications = false;
        }

        this.notificationsTotalCount = res.totalCount;
        if (state == 'initial') {
          this.notificationsList = res.notifications;
        } else {
          this.notificationsList = [...res.notifications];
        }

        if (this.notificationsList.length == 0) {
          this.noNotifiCationsItems = true;
        } else {
          this.noNotifiCationsItems = false;
        }
      }, err => this.notificationLoading = false);
    }

  }

  checkNotifications() {
    if (!this.notificationLoading && this.notificationsList.length == 0) {
      this.getNotifications(false);
    }
  }

  reloadNotification() {
    this.notificationsPageNumber = 1;
    this.notificationsTotalCount = 0;
    this.noNotifiCationsItems = false;
    this.notificationLoading = false;
    this.reloadingNotifications = true;
    this.getNotifications('initial', true);
  }

  lazyLoadNotifications() {
    if (this.notificationsList.length < this.notificationsTotalCount) {
      this.notificationsPageNumber = this.notificationsPageNumber + 1;
      this.getNotifications(false);
    }
  }

  checkProfileFirstLetters(loggedInUserDetails) {
    let firstName: string = loggedInUserDetails.firstName ? loggedInUserDetails.firstName : '';
    let lastName: string = loggedInUserDetails.lastName ? loggedInUserDetails.lastName : '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  showChangePasswordPanel() {
    this.showUpdatePasswordModal = true;
    let endPoint = 'user/UpdatePasswordGenerateCode';
    this.logInservice.updatePasswordGenerateCode(endPoint).subscribe(resp => {
      if (resp) {
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'OTP sent to your registered mobile number' });
        this.passwordSecurityCode = resp;
      }
    });
  }

  updatePassword(updatePasswordForm: NgForm) {
    updatePasswordForm.control.markAllAsTouched();
    if (updatePasswordForm.valid) {
      let endPoint = 'User/UpdatePassword';
      let payLoad = {
        "userSecurityCodeID": this.passwordSecurityCode.data.userSecurityCodeID,
        "code": this.newPasswordObj.confirmOTP,
        "password": this.newPasswordObj.newPassword
      }
      this.logInservice.updatePassWord(endPoint, payLoad).subscribe(resp => {
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Password updated successfully' });
        updatePasswordForm.reset();
        this.showUpdatePasswordModal = false;
      });
    }
  }

  cancelChanges(updatePasswordForm: NgForm) {
    updatePasswordForm.reset();
    this.showUpdatePasswordModal = false;
    this.passwordSecurityCode = null;
  }

  ngOnDestroy() {
    this.authDetailsSubscription.unsubscribe();
  }

  logOut() {
    this.authService.logOutUser();
  }

  navigateToPage(notification) {
    let navigation: navigateAction;
    notification.visited = true;
    if (notification.notificationType == 'EVENTS_INVITATION') {
      navigation = {
        ROUTE: 'testtt/events',
        NAVIGATION_TYPE: 'MAIN_NAVIGATION',
        OPTIONS: {
          NAVIGATION_PAGE: 'EVENTS',
          ACTIVE_TAB_INDEX: 2,
          SHOW_SIDEBAR: false
        }
      }
    } else if (notification.notificationType == 'GROUPS_INVITATION') {
      navigation = {
        ROUTE: 'testtt/groups',
        NAVIGATION_TYPE: 'MAIN_NAVIGATION',
        OPTIONS: {
          NAVIGATION_PAGE: "GROUPS",
          ACTIVE_TAB_INDEX: 2,
          SHOW_SIDEBAR: false
        }
      }
    } else if (notification.notificationType == 'NETWORK_INVITATION') {
      navigation = {
        ROUTE: 'testtt/network',
        NAVIGATION_TYPE: 'MAIN_NAVIGATION',
        OPTIONS: {
          NAVIGATION_PAGE: "NETWORK",
          ACTIVE_TAB_INDEX: 0,
          SHOW_SIDEBAR: false,
          SUB_SCREEN_NAVOPTIONS: {
            NAVIGATION_PAGE: "MYCONNECTIONS",
            ACTIVE_TAB_INDEX: 1,
            SHOW_SIDEBAR: false,
          }
        }
      }
    }

    this.globalNavigate.navigateToRoute(navigation);
  }

  navigateToProfile() {
    this.router.navigate(['testtt/profile', this.loggedInUserDetails.profileId])
  }

  hamburgerClick() {
    this.homburgerClicked.emit(true);
  }

}
