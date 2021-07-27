import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from './../common/ngx-loader/lib/public_api';
import { AuthService } from './../services/auth.service';
import { MessageService } from 'primeng/api';
import { LoginServiceService } from './login-service.service';
import { COUNTRY_CODES } from '../common/global.constants';
import anime from 'animejs/lib/anime.es.js';
import { securityCodeResp } from '../common/models/profile.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {

  userName: string;
  password: string;
  completeSignUpModel: boolean = false;

  //otp Timer Variable
  timeleft: number = 0;
  otpTimer: any;
  changeRegisterPhoneNumber: boolean = false;
  passwordSecurityCode: securityCodeResp;
  resetPasswordSecurityCode: securityCodeResp;

  animatee: any;

  COUNTRY_LIST = JSON.parse(JSON.stringify(COUNTRY_CODES));
  selectedCountryCode: any;

  signUpObj: { [key: string]: any } = {
    "firstName": "",

    "lastName": "",

    "city": "",

    "state": "",

    "code": null,

    "countryCode": null,

    "country": "",

    "phone": "",

    "email": "",

    "password": "",

    "confirmPassword": ""
  }
  signUpObjCopy;

  recoverPassWordObj: any = {
    code: null,
    countryCode: '',
    phone: '',
  }

  resetPasswordObj: any = {
    code: null,
    countryCode: '',
    phone: '',
    newPassword: '',
    newConfirmPassword: '',
    confirmOTP: ''
  }

  confirmOTP: any = null;

  displaySignUpModal: boolean = false;
  visibleSidebar: boolean = false;
  forgottPassword: boolean = false;
  showLoading: boolean = false;
  loadingCustomText: string = '';

  showWarning: boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes.threeBounce;
  constructor(private router: Router,
    private loginService: LoginServiceService,
    public messageService: MessageService,
    private authService: AuthService
  ) {
    this.checkAlreadyLoggedIn();
  }

  ngOnInit(): void {
  }

  checkAlreadyLoggedIn() {
    if ("authDetails" in localStorage) {
      let authDetails = JSON.parse(localStorage.getItem("authDetails"));
      if (authDetails['token']) {
        this.router.navigate(['testtt/groupsPosts/details']);
      } else {
        this.router.navigate(['login']);
      }
    } else {
      this.router.navigate(['login']);
    }
  }

  ngOnDestroy() {

  }

  validateLogin(loginForm: NgForm) {
    this.showWarning = false;
    if (loginForm.valid) {
      this.showLoading = true;
      this.loadingCustomText = 'Logging In';
      let endPoint = 'User/login';
      this.loginService.logIn(endPoint, loginForm.value).subscribe(resp => {
        this.showLoading = false;
        this.loadingCustomText = '';
        if (resp.success) {
          this.authService.setAuthDetails(resp.data);
          this.router.navigate(['testtt/groupsPosts/details']);
        }
      }, (error) => {
        this.showLoading = false;
        this.loadingCustomText = '';
        // this.messageService.add({ severity: 'error', summary: 'Error Message', detail: error.message });
      });
    } else {
      loginForm.control.markAllAsTouched();
      this.showWarning = true;
    }
  }

  createAccount(signUpForm: NgForm) {
    let endPoint = 'User/Register';
    if (signUpForm.valid) {
      this.showLoading = true;
      this.loadingCustomText = 'Creating Account';
      let signUpDetails = Object.assign({}, this.signUpObj);
      delete signUpDetails.confirmPassword;
      delete signUpDetails.code;
      this.loginService.registerUser(endPoint, signUpDetails).subscribe(resp => {
        this.showLoading = false;
        if (resp.success) {
          // signUpForm.reset();
          // this.visibleSidebar = false;
          this.passwordSecurityCode = resp;
          this.signUpObjCopy = Object.assign({}, this.signUpObj);
          this.completeSignUpModel = true;
          this.runTimer();
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: `OTP sent to your mobile number ${this.signUpObj.phone}. OTP is valid for 5 minute's` });
        }
      }, (error) => {
        this.showLoading = false;
        this.loadingCustomText = '';
        // this.messageService.add({ severity: 'error', summary: 'Error Message', detail: error.message });
      });
    } else {

      signUpForm.controls.code.markAsTouched();
      signUpForm.controls.code.markAsDirty();
      signUpForm.control.markAllAsTouched();
    }
    // this.runTimer();
    // this.completeSignUpModel = true;
    // this.signUpObjCopy = Object.assign({}, this.signUpObj);
  }

  completeRegistration(validateOTPForm: NgForm) {
    if (validateOTPForm.valid) {
      let endPoint = 'user/ValidateCode';
      this.showLoading = true;
      this.loadingCustomText = 'Validating OTP. Please wait...';
      let signUpDetails = Object.assign({}, this.signUpObj);
      delete signUpDetails.confirmPassword;
      let payLoad = {
        "profileID": this.passwordSecurityCode?.data.profileID,

        "userSecurityCodeID": this.passwordSecurityCode?.data.userSecurityCodeID,

        "code": this.confirmOTP
      };
      // let payLoad = {
      //   "profileID":"weccscsc",

      //   "userSecurityCodeID": "ffffffff",

      //   "code": 123456
      // };
      this.loginService.completeRegistration(endPoint, payLoad).subscribe(resp => {
        this.showLoading = false;
        this.loadingCustomText = '';
        this.confirmOTP = null;
        if (resp) {
          this.visibleSidebar = false;
          this.completeSignUpModel = false;
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: `Account created successfully. Please Log In` });
        }
      }, (error) => {
        this.showLoading = false;
        this.loadingCustomText = '';
        // this.messageService.add({ severity: 'error', summary: 'Error Message', detail: error.message });
      });
    } else {
      validateOTPForm.control.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: `Required fields are missing` });
    }

  }

  resendOTP() {
    if (!this.signUpObj.countryCode) {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: `Country Code is Required` });
      return;
    } else if (!this.signUpObj.phone) {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: `Phone Number is Required` });
      return;
    }
    let endPoint = 'user/ReGenerateRegistrationCode';
    let payLoad: any = {
      "profileID": this.passwordSecurityCode?.data.profileID
    };

    if (this.signUpObjCopy.phone != this.signUpObj.phone || this.signUpObjCopy.countryCode != this.signUpObj.countryCode) {
      this.signUpObjCopy = Object.assign({}, this.signUpObj);
      payLoad.countrycode = this.signUpObj.countryCode;
      payLoad.phone = this.signUpObj.phone;
    }
    this.loginService.reGenerateRegistrastionCode(endPoint, payLoad).subscribe(resp => {
      if (resp) {
        this.passwordSecurityCode = resp;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: `OTP sent to your mobile number ${this.signUpObj.phone}. OTP is valid for 5 minute's` });
      }
    })
    this.changeRegisterPhoneNumber = false;
    this.runTimer();
  }

  runTimer() {
    if (this.timeleft <= 0) {
      this.timeleft = 90;
      let that = this;
      this.otpTimer = setInterval(function () {
        if (that.timeleft <= 0) {
          clearInterval(that.otpTimer);
        }
        that.timeleft -= 1;
      }, 1000);
    }
  }

  changePhoneNumber() {
    this.changeRegisterPhoneNumber = true;
  }

  countryCodeChange(event, signUpObj) {

    if (signUpObj) {
      signUpObj.countryCode = event.dial_code;
    }
  }

  confirmChangeNumber(signUpObj) {
    if (!this.signUpObj.countryCode) {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: `Country Code is Required` });
      return;
    } else if (!this.signUpObj.phone) {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: `Phone Number is Required` });
      return;
    }
    this.resendOTP();
    this.changeRegisterPhoneNumber = false;
  }

  cancelChangeNumber() {
    this.signUpObj = Object.assign({}, this.signUpObjCopy);
    this.changeRegisterPhoneNumber = false;
  }

  closeSignUpModal() {
    this.completeSignUpModel = false;
    this.timeleft = 0;
    this.signUpObj = Object.assign({}, this.signUpObjCopy);
    this.changeRegisterPhoneNumber = false;
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
    }
  }


  clearSignUp(signUpForm: NgForm) {
    signUpForm.reset();
    this.visibleSidebar = false
  }

  sideBarHide(signUpForm: NgForm) {
    signUpForm.reset();
  }

  showSignUp() {
    this.visibleSidebar = true;
  }

  forotPasswodCodeGenerator(forgotPasswordOTPForm: NgForm) {
    if (forgotPasswordOTPForm.valid) {
      let endPoint = "user/ForgotPasswordGenerateCode";
      let payLoad = {
        "countrycode": this.recoverPassWordObj.countryCode,

        "phone": this.recoverPassWordObj.phone
      }
      this.loginService.forgottPasswordGenerateCode(endPoint, payLoad).subscribe(resp => {
        if (resp && resp.success) {
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: `OTP sent to your mobile number ${this.recoverPassWordObj.phone}. OTP is valid for 5 minute's` });
          this.resetPasswordSecurityCode = resp;
          this.resetPasswordObj.code = this.recoverPassWordObj.code;
          this.resetPasswordObj.countryCode = this.recoverPassWordObj.countryCode;
          this.resetPasswordObj.phone = this.recoverPassWordObj.phone;
        }
      })
    } else {
      forgotPasswordOTPForm.controls.countryCode.markAsDirty();
      forgotPasswordOTPForm.control.markAllAsTouched();
      if (!this.recoverPassWordObj.countryCode) {
        this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: `Country Code is Required` });
        return;
      } else if (!this.recoverPassWordObj.phone) {
        this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: `Phone Number is Required` });
        return;
      }

    }
  }

  forgotPasowrUpdateHandler(forgotPasswordUpdateOTPForm: NgForm) {
    if (forgotPasswordUpdateOTPForm.valid) {
      let endPoint = "user/ForgotPasswordUpdate";
      let payLoad = {
        "userSecurityCodeID": this.resetPasswordSecurityCode.data.userSecurityCodeID,

        "code": this.resetPasswordObj.confirmOTP,

        "Password": this.resetPasswordObj.newConfirmPassword,

        "countrycode": this.resetPasswordObj.countryCode,

        "phone": this.resetPasswordObj.phone
      }
      this.loginService.ForgotPasswordUpdate(endPoint, payLoad).subscribe(resp => {
        if (resp && resp.success) {
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: `Password Updated successfully.` });
          this.forgottPassword = false;
        }
      })
    } else {
      forgotPasswordUpdateOTPForm.control.markAllAsTouched();
    }
  }

  formReset(form1Obj, form2Obj?) {
    if (form1Obj) {
      let keys = Object.keys(form1Obj);
      for (let i = 0; i <= keys.length; i++) {
        form1Obj[keys[i]] = null;
      }
    }
    if (form2Obj) {
      let keys = Object.keys(form2Obj);
      for (let i = 0; i <= keys.length; i++) {
        form1Obj[keys[i]] = null;
      }
    }

  }

  RecoverPasswordModalHide(obj1, obj2) {
    this.formReset(obj1, obj2);
    this.resetPasswordSecurityCode = null;
  }

  animate(ref) {
    // if (!this.animatee) {
    //   this.animatee = anime({
    //     targets: ref,
    //     opacity: 0.1,
    //     loop: true,
    //     easing: 'easeInOutExpo',
    //     delay: 1000
    //   });
    // }
  }

}
