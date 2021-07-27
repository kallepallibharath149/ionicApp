import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GlobalEmittingEventsService } from '../services/global-emitting-events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.less']
})
export class PageNotFoundComponent implements OnInit,AfterViewInit {
  

  constructor(private router:Router,
              private globalEmitterService:GlobalEmittingEventsService ) { }

  ngOnInit(): void {
    // gsap.registerPlugin(PixiPlugin, MotionPathPlugin);
  }

  navigateToHome(){
    this.router.navigate(['testtt/groupsPosts/details']);
  }

  ngAfterViewInit(){
    // this.doIt();  
  }

  // doIt(): void {
  //   gsap.fromTo(this.box.nativeElement, 10, {width:'100px'}, {width:'400px'});
  //   gsap.fromTo(this.box.nativeElement, 10, {y: 20}, {y: 440});
  //   }
}
