import { Component, OnInit } from '@angular/core';
import { GlobalEmittingEventsService } from '../services/global-emitting-events.service';
import { Router } from '@angular/router';
import { GroupsService } from './groups.service';
import { eventAction } from './../common/models/profile.model';
import { EventsService } from './../services/events.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.less']
})
export class GroupsComponent implements OnInit {
  constructor(private globalEmitterService: GlobalEmittingEventsService,
    private router: Router,
    private groupService: GroupsService,
    private eventService: EventsService
  ) {
    let action: eventAction = {
      ACTION_TYPE: 'MAIN_NAVIGATION_STATE',
      VALUE: 'Groups'
    }
    this.eventService.setEvent(action);
  }

  ngOnInit(): void {
  }


}
