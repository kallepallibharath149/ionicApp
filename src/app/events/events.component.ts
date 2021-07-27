import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { eventAction } from './../common/models/profile.model';
import { EventsService } from './../services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit {

  activeItem: string = '';
  constructor(private router: Router,
    private eventService: EventsService) { }

  ngOnInit(): void {
    let action: eventAction = {
      ACTION_TYPE: 'MAIN_NAVIGATION_STATE',
      VALUE: 'Events'
    }
    this.eventService.setEvent(action);
  }


}
