import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})
export class ModalOpenCanDeactivateGuardGuard implements CanDeactivate<any> {
  constructor ( public activeModal: NgbActiveModal,
               private modalService: NgbModal,
               private router: Router
               ) { }

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ):  boolean | Observable<boolean> {
    let modalOpenStatus = this.modalService.hasOpenModals();
    if (modalOpenStatus) {
      this.modalService.dismissAll('');
      return false;
    } else {
      return true;
    }
  }

}
