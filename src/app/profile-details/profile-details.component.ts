import { Component, OnInit, ElementRef, Renderer2, OnDestroy, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { GlobalEmittingEventsService } from '../services/global-emitting-events.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../interceptors/http.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../services/auth.service';
import { eventAction } from '../common/models/profile.model';
import { EventsService } from '../services/events.service';
import { MessageService } from 'primeng/api';
import { ngxLoadingAnimationTypes } from '../common/ngx-loader/lib/ngx-loading-config';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.less']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes.threeBounce;
 userDetails:any = null;
 currentProfileId:any = '';
 currentProfileName:any = '';
 currentProfileDetails:any ;
 currentProfileDetailsCopy:any;
 updateInProgress:boolean = false;
 showFooter:boolean = false;
 @ViewChildren('inlineEdit') inlineEdit:QueryList<any>;

  userDetailsForm:any = {
    "profileId": "",
    "firstName": "",
    "lastName": "",
    "address1": "",
    "address2": "",
    "city": "",
    "state": "",
    "country": "",
    "zipPin": "",
    "phone": "",
    "countryCode":"" ,
    "email": ""
  }

  isMyProfile: boolean = false ;
  authDetailsSubscription:Subscription;

  constructor(private _elementRef: ElementRef,
    private renderer: Renderer2,
    private globalEmitterService: GlobalEmittingEventsService,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventsService,
    private httpService:HttpService,
    public messageService: MessageService) {
      let action: eventAction = {
        ACTION_TYPE: '',
        VALUE: 'Profile'
      }
      this.eventService.setEvent(action);
    }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentProfileId = params.get('id');
      this.isMyProfile = false;
      this.showFooter = false; 
      if(this.inlineEdit){
        this.inlineEdit.toArray().forEach(element => {
          element.deactivate(); 
        });
      }
      this.getProfileDetails();
    });
    this.authDetailsSubscription = this.authService.authDetails.subscribe(authData =>{
      if(authData != 'initial'){
       this.userDetails = this.authService.getUserDetails();
      }
   });
  }

  getProfileDetails(){
    let endPoint = `user`;
    this.authService.getuserDetailsByProfileID(this.currentProfileId, endPoint).subscribe(resp =>{
      if(resp){
       this.currentProfileDetails = resp;
       this.currentProfileDetailsCopy = JSON.parse(JSON.stringify(resp));
       this.setFormData();
       this.currentProfileName = `${resp.firstName} ${resp.lastName}`;
       if(this.userDetails && resp){
         this.isMyProfile = this.userDetails.profileId == this.currentProfileId; 
       }
      }
     });
  }


  navigate(navItem) {
    if(navItem.navigate && navItem.navigate.length>0){
    //this.router.navigateByUrl(`profile/${this.currentProfileId}${navItem.navigate?'/'+navItem.navigate:''}`);
    this.router.navigate([`testtt/profile/${this.currentProfileId}`,navItem.navigate]);
    } else if(!navItem.navigate){
      if(navItem.label =='Timeline'){
        this.router.navigate([`testtt/profile/${this.currentProfileId}`]);
      }
    }  
  }

  updateProfileDetails() {
    if(!this.updateInProgress){
      let body: FormData = new FormData();
      let payLoad = JSON.parse(JSON.stringify(this.userDetailsForm));
      body.append('Data', JSON.stringify(payLoad));
      let endPoint = `User/Details`;
      this.updateInProgress = true;
      this.authService.updateUserDetails(endPoint,body).subscribe(resp =>{
        this.updateInProgress = false;
          let typeMsg = `Profile details updated successfully`;
          if(this.isMyProfile){
            this.authService.reloadUserDetails('user').subscribe(resp =>{
              this.setCurrentUserDetails(resp);
              });
          }
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: typeMsg });
         if(this.inlineEdit){
        this.inlineEdit.toArray().forEach(element => {
          element.deactivate(); 
        });
      }
      }, err=>{this.updateInProgress = false;});
    }
  }

  setCurrentUserDetails(data){
    if(data){
      this.currentProfileDetails = data;
      this.currentProfileDetailsCopy = JSON.parse(JSON.stringify(data));
      this.currentProfileName = `${data.firstName} ${data.lastName}`;
      if(this.userDetails && data){
        this.isMyProfile = this.userDetails.profileId == this.currentProfileId; 
      }
    }
  }

  setFormData(){
    let formData = JSON.parse(JSON.stringify(this.currentProfileDetails))
    this.userDetailsForm = {
      "profileId": formData.profileId,
      "firstName": formData.firstName,
      "lastName": formData.lastName,
      "address1": formData.address1,
      "address2": formData.address2,
      "city": formData.city,
      "state": formData.state,
      "country": formData.country,
      "zipPin": formData.zipPin,
      "phone": formData.phone,
      "countryCode":formData.countryCode,
      "email": formData.email
    }  
  }

  showInlineEdit(){
    this.showFooter = true;
  }

saveChanges(){
  this.showFooter = false; 
  this.updateProfileDetails();
}

  cancelChanges(){
    this.showFooter = false; 
    if(this.inlineEdit){
      this.inlineEdit.toArray().forEach(element => {
        element.deactivate(); 
      });
    }
    this.setFormData();
  }

  ngOnDestroy(){
    this.authDetailsSubscription.unsubscribe();
  }

}
