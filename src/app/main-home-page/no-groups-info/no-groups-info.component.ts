import { Component, OnInit } from '@angular/core';
import { navigateAction } from './../../common/models/profile.model';
import { GlobalNavigateService } from './../../services/global.navigate.service';

@Component({
  selector: 'app-no-groups-info',
  templateUrl: './no-groups-info.component.html',
  styleUrls: ['./no-groups-info.component.less']
})
export class NoGroupsInfoComponent implements OnInit {

  constructor( private globalNavigate:GlobalNavigateService) { }

  ngOnInit(): void {
  }

  navigateToCreateGroup(){
    let navigation:navigateAction;
      navigation = {
        ROUTE:'testtt/groups',
        NAVIGATION_TYPE:'MAIN_NAVIGATION',
        OPTIONS:{
          NAVIGATION_PAGE:'GROUPS',
          SHOW_SIDEBAR:true
         }
        } 
    this.globalNavigate.navigateToRoute(navigation);
  }

}
