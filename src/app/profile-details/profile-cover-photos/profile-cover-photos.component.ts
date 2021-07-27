import { Component, OnInit, Input, ViewChild, NgZone, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPostsService } from '../../posts/user-posts/user-post-service/user-posts-service';
import { HttpService } from './../../interceptors/http.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalEmittingEventsService } from './../../services/global-emitting-events.service';
import { AuthService } from './../../services/auth.service';
import { MessageService } from 'primeng/api';
import { filesBaseURL } from './../../common/global.constants';

@Component({
  selector: 'app-profile-cover-photos',
  templateUrl: './profile-cover-photos.component.html',
  styleUrls: ['./profile-cover-photos.component.less']
})
export class ProfileCoverPhotosComponent implements OnInit {
  @Input('coverPhoto') coverPhoto = '';
  @Input('profilePhoto') profilePhoto = '';
  coverPhotoAvailable:boolean = false;
  profilePhotoAvailable:boolean = false;
  @Input('isMyProfile') isMyProfile = false;
  @Input('currentProfileDetails') set currentProfileDetails(val:any){
    if(val){
      this._currentProfileDetails  = val;
      this._currentProfileDetailsCopy = JSON.parse(JSON.stringify(val));
      this.coverPhoto = `${this.filesBaseURL}${this._currentProfileDetails.profileCoverImageUrl}`;
      this.profilePhoto = `${this.filesBaseURL}${this._currentProfileDetails.profileImageUrl}`;
      this.coverPhotoAvailable = this._currentProfileDetails?.profileCoverImageUrl;
      this.profilePhotoAvailable = this._currentProfileDetails?.profileImageUrl;
    }
  }
  _currentProfileDetails:any;
  _currentProfileDetailsCopy:any;
  currentProfileId: string = null;
  proFileDetailsresponseObj: any;
  selectedPhotoUrl: any;
  selectedFile:File;
  profileDetailsResponse: boolean = false;
  updateInProgress:boolean = false;
  @ViewChild('confirmImageTemplate') confirmImageTemplate;
  modalReference: any;
  closeResult = '';
  imageSrc: any;
  header: string = null;
  filesBaseURL:any;

  constructor(public domSanitizationService: DomSanitizer,
    private zone: NgZone,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private userPostsService: UserPostsService,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private globalEmitterService: GlobalEmittingEventsService,
    private authService: AuthService ,
    public messageService: MessageService,

  ) { 
    this.filesBaseURL = filesBaseURL;
  }

  ngOnInit(): void {
  
  }

  coverPhotoUpload() {
    $("#cover-photo-upload").click();
  }

  profilePhotoUpload() {
    $("#profile-photo-upload").click();
  }
  // this.selecteGroupImage = event.target.files[0];
  handlePhotoUpload(event, photoType) {
    // let selectedFile: any;
    if (photoType == 'coverPhoto') {
      this.selectedFile = event.target.files[0];
      this.header = 'Cover Photo';
    } else if (photoType == 'profilePhoto') {
      this.selectedFile = event.target.files[0];
      this.header = 'Profile Photo';
    }
    this.selectedPhotoUrl = URL.createObjectURL(this.selectedFile);
    // formData.append('myFile', dataa);
    // formData.append('myfilename',dataa.name);
    // const blob = URL.createObjectURL(this.selectedImage);

    this.imageSrc = this.domSanitizationService.bypassSecurityTrustUrl(this.selectedPhotoUrl);
    this.openModal(this.confirmImageTemplate);
  }

  openModal(content) {
    this.modalReference = this.modalService.open(this.confirmImageTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true, backdrop : 'static' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.imageSrc = null;
      this.header = null;
    });
  }

  closeModal(modal) {
    this.modalReference.close();
    this.imageSrc = null;
    this.selectedPhotoUrl = null;
    this.header = null;
  }

  updatePhoto() {
    if(!this.updateInProgress){
      let body: FormData = new FormData();
      if (this.header == 'Cover Photo') {
        body.append('FileProfileCover', this.selectedFile);
      } else if(this.header == 'Profile Photo'){
        body.append('FileProfile', this.selectedFile);
      }
      let payLoad = JSON.parse(JSON.stringify(this._currentProfileDetails));
  
      body.append('Data', JSON.stringify(payLoad));
      let endPoint = `User/Details`;
      this.updateInProgress = true;
      this.authService.updateUserDetails(endPoint,body).subscribe(resp =>{
        this.updateInProgress = false;
          let typeMsg = ``;
          if (this.header == 'Cover Photo') {
            typeMsg = `Cover Photo Updated Successfully`;        
          } else if (this.header == 'Profile Photo') {
            typeMsg = `Profile Photo Updated Successfully`;
          }
          this.authService.reloadUserDetails('user').subscribe(resp =>{
          this.setCurrentUserDetails(resp);
          });
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: typeMsg });
        this.ref.detectChanges();
        this.closeModal('');
      }, err=>{this.updateInProgress = false;});
    }
  }

  setCurrentUserDetails(data){
    if(data){
      this._currentProfileDetails  = data;
      this._currentProfileDetailsCopy = JSON.parse(JSON.stringify(data));
      this.coverPhoto = `${this.filesBaseURL}${this._currentProfileDetails.profileCoverImageUrl}`;
      this.profilePhoto = `${this.filesBaseURL}${this._currentProfileDetails.profileImageUrl}`;
      this.coverPhotoAvailable = this._currentProfileDetails?.profileCoverImageUrl;
      this.profilePhotoAvailable = this._currentProfileDetails?.profileImageUrl;
    }
  }

}
