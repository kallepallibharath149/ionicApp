import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { CanRedirectToGroupsHomeGuard } from './../common/guards/can-redirect-to-groups-home.guard';
import { ModalOpenCanDeactivateGuardGuard } from './../common/guards/modal-open-can-deactivate-guard.guard';
import { EventsListComponent } from './../events/events-list/events-list.component';
import { EventsComponent } from './../events/events.component';
import { GroupsListComponent } from './../groups/groups-list/groups-list.component';
import { GroupsComponent } from './../groups/groups.component';
import { GroupspreviewComponent } from './../groups/groupspreview/groupspreview.component';
import { MainHomePageComponent } from './../main-home-page/main-home-page.component';
import { MainPageGroupsContainerComponent } from './../main-home-page/main-page-groups-container/main-page-groups-container.component';
import { NoGroupsInfoComponent } from './../main-home-page/no-groups-info/no-groups-info.component';
import { ProfileDetailsComponent } from './../profile-details/profile-details.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NetworksComponent } from '../networks/networks.component';


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent,
    children: [

      {
        path: 'groupsPosts', component: MainHomePageComponent,
        children: [
          { path: 'details', component:MainPageGroupsContainerComponent  },
          { path: 'noGroups', component: NoGroupsInfoComponent  }
        ]
      },

      { path: 'network', component:NetworksComponent  },
      {
         path: 'groups', component: GroupsComponent,
        children: [
          { path: '', component: GroupsListComponent },
          { path: 'preview/:groupId', component: GroupspreviewComponent}
        ]
      },

      {
        path: 'events', component: EventsComponent,
        children: [
          { path: '', component: EventsListComponent }
        ]
      },

      {
        path: 'profile/:id', component: ProfileDetailsComponent,
        // canDeactivate: [ModalOpenCanDeactivateGuardGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,]
})
export class MainAppModuleRoutingModule {
}
