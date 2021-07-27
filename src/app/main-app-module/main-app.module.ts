import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAppModuleRoutingModule } from './main-app-module-routing.module';
import { SharedServiceModule } from './../common/shared.module';
import { DragulaModule } from 'ng2-dragula';
import { NgxLoadingModule } from './../common/ngx-loader/lib/ngx-loading.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { TopBannerComponent } from './../top-banner/top-banner.component';
import { TopNavigationMenuComponent } from './../top-banner/top-navigation-menu/top-navigation-menu.component';
import { AccountAndProfileComponent } from './../top-banner/account-and-profile/account-and-profile.component';
import { LeftContainerComponent } from './../main-home-page/left-container/left-container.component';
import { RightContainerComponent } from './../main-home-page/right-container/right-container.component';
import { MainHomePageComponent } from './../main-home-page/main-home-page.component';
// import { RedirectTogroupsComponent } from './../main-home-page/main-page-groups-container/redirect-togroups/redirect-togroups.component';
// import { CanRedirectToGroupsHomeGuard } from './../common/guards/can-redirect-to-groups-home.guard';
import { MainPageGroupsContainerComponent } from './../main-home-page/main-page-groups-container/main-page-groups-container.component';
import { PostComponent } from '../posts/post.component';
import { GroupsComponent } from './../groups/groups.component';
import { GroupsListComponent } from './../groups/groups-list/groups-list.component';
import { GroupspreviewComponent } from './../groups/groupspreview/groupspreview.component';
import { EventsComponent } from './../events/events.component';
import { EventsListComponent } from './../events/events-list/events-list.component';
import { ProfileDetailsComponent } from './../profile-details/profile-details.component';
import { ModalOpenCanDeactivateGuardGuard } from './../common/guards/modal-open-can-deactivate-guard.guard';
import { PostUploadComponent } from '../posts/post-upload/post-upload.component';
import { UserPostsComponent } from '../posts/user-posts/user-posts.component';
import { PostDetailsComponent } from '../posts/user-posts/post-details/post-details.component';
import { ProfileCoverPhotosComponent } from './../profile-details/profile-cover-photos/profile-cover-photos.component';
import { SecureFilesUrlPipe } from './../common/pipes/secureFiles.pipe';
import { OverLayComponentComponent } from './../common/over-lay-component/over-lay-component.component';
import { CommentsContainerComponent } from './../common/comments-container/comments-container.component';
import { MainCommentComponent } from './../common/comments-container/main-comment/main-comment.component';
import { ReplyCommentComponent } from './../common/comments-container/main-comment/reply-comment/reply-comment.component';
import { ProfileWithCommentsComponent } from './../common/profile-with-comments/profile-with-comments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoGroupsInfoComponent } from '../main-home-page/no-groups-info/no-groups-info.component';
import { TimeAgo } from '../common/pipes/time-ago.pipe';
import { GroupinfoComponent } from '../groups/groupspreview/groupinfo/groupinfo.component';
import { NetworksComponent } from './../networks/networks.component';
import { ConnectionsComponent } from './../networks/connections/connections.component';
import { NetworkComponent } from '../networks/network/network.component';
import { RelationGraphComponent } from '../networks/network/relation-graph/relation-graph.component';
import { EventinfoComponent } from './../events/events-list/eventsInfo/eventinfo.component';
import { AddressFormatt } from '../common/pipes/addressFormatter.pipe';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    NetworksComponent,
    MainLayoutComponent,
    TopBannerComponent,
    TopNavigationMenuComponent,
    AccountAndProfileComponent,
    LeftContainerComponent,
    RightContainerComponent,
    MainHomePageComponent,
    MainPageGroupsContainerComponent,
    PostComponent,
    PostUploadComponent,
    UserPostsComponent,
    PostDetailsComponent,
    GroupsComponent,
    GroupsListComponent,
    GroupspreviewComponent,
    GroupinfoComponent,
    EventsComponent,
    EventsListComponent,
    ProfileDetailsComponent,
    ProfileCoverPhotosComponent,
    OverLayComponentComponent,
    CommentsContainerComponent,
    MainCommentComponent,
    ReplyCommentComponent,
    ProfileWithCommentsComponent,
    NetworkComponent,
    RelationGraphComponent,
    SecureFilesUrlPipe,
    TimeAgo,
    AddressFormatt,

    NoGroupsInfoComponent,
    ConnectionsComponent,
    EventinfoComponent
  ],
  imports: [
    CommonModule,
    SharedServiceModule,
    MainAppModuleRoutingModule,
    DragulaModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ReactiveFormsModule,
    FormsModule,
    
  ],
  providers: [ModalOpenCanDeactivateGuardGuard, ConfirmationService]
})
export class MainAppModule { }
