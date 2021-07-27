import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { UserPostsService } from '../user-posts/user-post-service/user-posts-service';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from '../../groups/groups.service';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from '../../common/ngx-loader/lib/public_api';
import { groupPostReloadService } from '../../main-home-page/main-page-groups-container/groupPost.reload';
import { MessageService } from 'primeng/api';
import * as $ from 'jquery';


@Component({
  selector: 'app-post-upload',
  templateUrl: './post-upload.component.html',
  styleUrls: ['./post-upload.component.less']
})
export class PostUploadComponent implements OnInit {
  @Input('currentGroupId')currentGroupId: any ='';
  closeResult = '';
  selectedImageVideoFiles: Array<File>;
  selectedImageVideoFilesObjectURLs: Array<any>;
  modalReference: any;
  postText: any = '';
  @ViewChild('content') content;
  @ViewChild('textPost') textPost;
  showLoading: boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes.threeBounce;

  PostSlideConfig = { "initialSlide": 0, "slidesToShow": 1, "slidesToScroll": 1, "dots": true, "centerPadding": '0px', "centerMode": true, "lazyLoad": 'ondemand' };

  constructor(private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private userPostsService: UserPostsService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private groupReloadService: groupPostReloadService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  open(content) {
    this.modalReference = this.modalService.open(content, { windowClass: 'postUpload-preview', ariaLabelledBy: 'modal-basic-title', centered: true });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.postText = null;
      this.clearBlobObjects();
    });
  }

  clearBlobObjects() {
    if(this.selectedImageVideoFilesObjectURLs && this.selectedImageVideoFilesObjectURLs.length){
      this.selectedImageVideoFilesObjectURLs.forEach(selectedFile => {
        URL.revokeObjectURL(selectedFile['blobUrl']);
      });
      this.selectedImageVideoFilesObjectURLs = [];
      let file = Array.from(this.selectedImageVideoFiles);
      file.splice(0, file.length);
      this.selectedImageVideoFiles = file;
    }
  }

  handleFiles(event) {
    this.selectedImageVideoFilesObjectURLs = [];
    this.selectedImageVideoFiles = [];
    this.selectedImageVideoFiles = [...event.target.files];
    Array.from(this.selectedImageVideoFiles).forEach(file => {
      let fileObj: any = {};
      let url = URL.createObjectURL(file);
      let imageIndex = file.type.indexOf('image');
      let videoIndex = file.type.indexOf('video');
      let pdfIndex = file.type.indexOf('pdf');
      if (imageIndex >= 0) {
        fileObj['fileType'] = 'image';
        // URL.revokeObjectURL(imgObj['url']); 
      }
      if (videoIndex >= 0) {
        fileObj['fileType'] = 'video';
      }
      if (pdfIndex >= 0) {
        fileObj['fileType'] = 'pdf';
      }
      if (pdfIndex >= 0) {
        fileObj['url'] = url;
      } else {
        fileObj['url'] = this.sanitizer.bypassSecurityTrustUrl(url);
      }
      fileObj['blobUrl'] = url;
      this.selectedImageVideoFilesObjectURLs.push(fileObj);
    });
    this.open(this.content);
  }

  handleFilesImageOrVideo(event) {
    const selectedFile: any = document.getElementById('upload_new_images_videos');
    let addedNewFiles: Array<File> = event.target.files;
    Array.from(addedNewFiles).forEach(file => {
      let fileObj: any = {};
      let ImageIndex = file.type.indexOf('image');
      let videoIndex = file.type.indexOf('video');
      let pdfIndex = file.type.indexOf('pdf');
      let url = URL.createObjectURL(file);
      if (ImageIndex >= 0) {
        fileObj['fileType'] = 'image';
      }
      if (videoIndex >= 0) {
        fileObj['fileType'] = 'video';
      }
      if (pdfIndex >= 0) {
        fileObj['fileType'] = 'pdf';
      }
      if (pdfIndex >= 0) {
        fileObj['url'] = url;
      } else {
        fileObj['url'] = this.sanitizer.bypassSecurityTrustUrl(url);
      }
      fileObj['blobUrl'] = url;
      this.selectedImageVideoFilesObjectURLs.push(fileObj);
      // URL.revokeObjectURL(imgObj['url']);
    });
    let slidePos = this.selectedImageVideoFiles.length;
    this.selectedImageVideoFiles = [...this.selectedImageVideoFiles, ...addedNewFiles];
    let configObj = Object.assign({}, this.PostSlideConfig);
    configObj.initialSlide = slidePos + 1;
    // this.PostSlideConfig = Object.assign({},);
  }

  closeModal(modal) {
    this.modalReference.close();
    this.postText = '';
  }

  PostUserStory(modal, postType?) {
    if (postType == 'textPost' && (!this.postText || this.postText.length <= 0)) {
      this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Please enter text to add new post' });
      return;
    } else if (postType == 'filesPost' && (this.selectedImageVideoFiles.length <= 0 && !this.postText)) {
      this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Please select files or provide post text' });
      return;
    }
    let body: FormData = new FormData();
    let postData = {
      "groupid": this.currentGroupId,
      "posttext": this.postText
    }
    if(this.selectedImageVideoFiles && this.selectedImageVideoFiles.length){
      Array.from(this.selectedImageVideoFiles).forEach(file => {
        body.append('Files', file);
      });
    }
    body.append('PostData', JSON.stringify(postData));
    let endPoint = `Post`
    // this.http.post(url, body);
    this.showLoading = true;
    this.groupService.postToGroup(endPoint, body).subscribe(resp => {
      this.showLoading = false;
      this.groupReloadService.reloadGroupPost(true);
      this.clearBlobObjects();
    }, (error) => {
      this.showLoading = false;
      this.clearBlobObjects();
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: error.message });
    });
    this.closeModal('');
  }

  newPostUploading(uploadType) {
    if (uploadType == 'image') {
      $("#upload_new_photos").click();
    } else if (uploadType == 'video') {
      $("#upload_new_videos").click();
    } else if (uploadType == 'imageOrvideo') {
      $("#upload_new_images_videos").click();
    }
  }

  removeSelectedUploadPost(itemIndex, resource) {
    URL.revokeObjectURL(this.selectedImageVideoFilesObjectURLs[itemIndex]['blobUrl']);
    this.selectedImageVideoFilesObjectURLs.splice(itemIndex, 1);
    let file = Array.from(this.selectedImageVideoFiles);
    file.splice(itemIndex, 1);
    this.selectedImageVideoFiles = file;
  }

  showVal(data) {
  }
}
