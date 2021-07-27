import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { GlobalEmittingEventsService } from './services/global-emitting-events.service';
import { MessageService } from 'primeng/api';
import { PlatformLocation } from '@angular/common'
import { Router, NavigationStart, Event } from '@angular/router';
import { LoginServiceService } from './login/login-service.service';
import { HttpService } from './interceptors/http.service';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgbProgressbarConfig]
})
export class AppComponent implements OnInit, AfterViewInit {
  environMent:any = '';

  constructor(private globalEmitterService: GlobalEmittingEventsService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private location: PlatformLocation,
    private router: Router,
    private loginService: LoginServiceService,
    private httpService: HttpService,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService) {
     this.logInCheck();
     }

  ngOnInit() {
    this.hideApplicationLoader();
    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    this.hideFreeHost();
    setTimeout(() => {
      this.connectionCheckListeners();
    }, 4000)
  }

  logInCheck() {
    if ("authDetails" in localStorage) {
      let authDetails = JSON.parse(localStorage.getItem("authDetails"));
      if (authDetails['token']) {
      this.authService.setAuthDetails(authDetails);
      } else {
        this.router.navigate(['login']);
      }
    } else {
      this.router.navigate(['login']);
    }
  }

  hideApplicationLoader() {
    document.getElementById('application-loader').style.display = "none";
  }

  hideFreeHost() {
    setTimeout(() => {
      $("a[title='Free Web Hosting with PHP5 or PHP7']").parent().css("display", "none");
    }, 2000);
  }

  // showSuccess() {
  //   this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
  // }

  // showInfo() {
  //   this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
  // }

  // showWarn() {
  //   this.messageService.add({ severity: 'warn', summary: 'Warn Message', detail: 'There are unsaved changes' });
  // }

  // showError() {
  //   this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
  // }

  // showCustom() {
  //   this.messageService.add({ key: 'custom', severity: 'info', summary: 'Custom Toast', detail: 'With a Gradient' });
  // }

  // showTopLeft() {
  //   this.messageService.add({ key: 'tl', severity: 'info', summary: 'Success Message', detail: 'Order submitted' });
  // }

  // showTopCenter() {
  //   this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Info Message', detail: 'PrimeNG rocks' });
  // }

  // showConfirm() {
  //   this.messageService.clear();
  //   this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed' });
  // }

  // showMultiple() {
  //   this.messageService.addAll([
  //     { severity: 'info', summary: 'Message 1', detail: 'PrimeNG rocks' },
  //     { severity: 'info', summary: 'Message 2', detail: 'PrimeUI rocks' },
  //     { severity: 'info', summary: 'Message 3', detail: 'PrimeFaces rocks' }
  //   ]);
  // }

  // onConfirm() {
  //   this.messageService.clear('c');
  // }

  // onReject() {
  //   this.messageService.clear('c');
  // }

  clear() {
    this.messageService.clear();
  }

  backToOnline() {
    this.clear();
    this.authService.emitOnlineState('online');
    this.messageService.add({ id: 2, severity: 'success', summary: 'Success Message', detail: 'Back to Online...' });
  }

  backToffLine() {
    this.messageService.add({ id: 2, severity: 'error', life: 1000000000, summary: 'Error Message', detail: 'You are offine. Please check your connection...' });
    this.authService.emitOnlineState('offline');
  }

  connectionCheckListeners() {
    if (!navigator.onLine) {
      this.backToffLine();
    }
    window.addEventListener("online", (ev) => {
      this.backToOnline();
    });
    window.addEventListener("offline", (ev) => {
      this.backToffLine();
    })
  }

  closeToastMessage(message) {
  }

}
