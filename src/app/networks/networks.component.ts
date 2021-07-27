import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalNavigateService } from '../services/global.navigate.service';
import { eventAction } from './../common/models/profile.model';
import { EventsService } from './../services/events.service';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.less']
})
export class NetworksComponent implements OnInit ,OnDestroy {
  navigationSubscription:Subscription;
  constructor(private eventService: EventsService, private globalNavigateService:GlobalNavigateService) {
    let action: eventAction = {
      ACTION_TYPE: 'MAIN_NAVIGATION_STATE',
      VALUE: 'Network'
    }
    this.eventService.setEvent(action);
    this.navigationSubscription = this.globalNavigateService.globalNavigationEvent.subscribe(action =>{
      if(action && action !=null){
        if(action.NAVIGATION_PAGE =='NETWORK'){
          if(action.SHOW_SIDEBAR){
             
          }
          if(action.ACTIVE_TAB_INDEX >=0){
            if(action.ACTIVE_TAB_INDEX == 0){
             this.tabClicked('myConnections');
            }  else if(action.ACTIVE_TAB_INDEX == 1){
              this.tabClicked('network');
            }
          }
        }
      }
    });
  }

  Tabs:Array<any> = [
    {
      tabName: 'My Connections',
      tabRef:'myConnections'
    },
    {
      tabName: 'Network',
      tabRef:'network'
    }
  ]

  currentTab: string = 'myConnections'

  ngOnInit(): void {
  }

  tabClicked(tabName) {
    this.currentTab = tabName;
  }

  ngOnDestroy(){
    this.navigationSubscription.unsubscribe();
  }

}
