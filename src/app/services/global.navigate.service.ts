import { Injectable } from '@angular/core';
import { navigateAction, optionsItems } from '../common/models/profile.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class GlobalNavigateService {


  public globalNavigationEvent = new BehaviorSubject<optionsItems | null>(null);

  constructor(private router: Router) {

  }

  navigateToRoute(state: navigateAction) {
    if (state.NAVIGATION_TYPE == 'SUB_NAVIGATION') {
      this.globalNavigationEvent.next(state.OPTIONS);
      this.router.navigate([state.ROUTE, state.SUBNAVIGATION_ID]);
    } else if (state.NAVIGATION_TYPE == 'MAIN_NAVIGATION') {
      this.globalNavigationEvent.next(state.OPTIONS);
      this.router.navigate([state.ROUTE]);
    }
    setTimeout(() => {
      this.globalNavigationEvent.next(null);
    }, 200)
  }

}
