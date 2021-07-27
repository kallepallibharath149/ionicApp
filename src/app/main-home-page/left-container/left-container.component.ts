import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { groups, groupsListResponse } from './../../groups/groups.model';
import { GroupsService } from './../../groups/groups.service';
import { GlobalEmittingEventsService } from './../../services/global-emitting-events.service';
import { Subscription } from 'rxjs';
import { EventsService } from './../../services/events.service';

@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.less']
})
export class LeftContainerComponent implements OnInit, OnDestroy {
 
  @Input('selectedGroup') selectedGroup: any;

  @Input('groupsListDetails')groupsListDetails: Array<groupsListResponse> = [];

  constructor(private router: Router,
    private eventService: EventsService) { }

  ngOnInit(): void {
  }

  navigateGroup(group: groupsListResponse, index) {
    this.selectedGroup = group;
    this.router.navigate(['testtt/groupsPosts/details']);
    this.eventService.setGroupEvent(group);
  }


  ngOnDestroy(){

  }

}
