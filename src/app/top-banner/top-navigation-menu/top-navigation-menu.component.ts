import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalEmittingEventsService } from 'src/app/services/global-emitting-events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-navigation-menu',
  templateUrl: './top-navigation-menu.component.html',
  styleUrls: ['./top-navigation-menu.component.less']
})
export class TopNavigationMenuComponent implements OnInit , OnDestroy {

  navigationEmitterSubscription:Subscription;
  currentActiveMenuItem:any;
 items:Array<any> = [
   {
     menuName: 'Home',
     icon: 'fa fa-home',
     navigationRoute: "testtt/groupsPosts/details",
     class: '',
     id: ''
   },
   {
     menuName: 'News',
     icon: 'fa fa-newspaper-o',
     navigationRoute: "testtt/news",
     class: '',
     id: ''
   },
   {
     menuName: 'Movies',
     icon: 'fa fa-youtube-play',
     navigationRoute: "testtt/movies",
     class: '',
     id: ''
   },

  //  {
  //    menuName: 'Market Place',
  //    icon: 'fa fa-university',
  //    navigationRoute: "/market",
  //    class: '',
  //    id: ''
  //  },
   {
     menuName: 'Groups',
     icon: 'fa fa-users',
     navigationRoute: "testtt/groups",
     class: '',
     id: ''
   },
   //this Hamburger should be at last index
   {
     menuName: 'Hamburger',
     icon: 'fa fa-bars',
     navigationRoute: "testtt/bookmarks",
     class: '',
     id: 'hamburger'
   }
];
  constructor(private location: Location,private router:Router,
             private routes:ActivatedRoute,
            private globalEmitterService:GlobalEmittingEventsService,
             private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
   //this.currentActiveMenuItem = this.items[0];
     this.navigationEmitterSubscription = this.globalEmitterService.navigationEventEmitter.subscribe(navigation=>{
      let filteredItem =  this.items.filter(item=>{
          return item.navigationRoute == navigation;
        });
        this.currentActiveMenuItem = filteredItem[0]?filteredItem[0]:{};
        this.cd.detectChanges();
      } 
      );
    // this.router.events.subscribe((val) => {
    //   if(this.location.path() != ''){
    //     let itemval = this.location.path();
    //   let filteredItem =  this.items.filter(item=>{
    //    // let finalItem = itemval.slice(1,itemval.length);
    //       return item.navigationRoute == itemval;
    //     });
    //     this.currentActiveMenuItem = filteredItem;
    //   } else {
    //     this.currentActiveMenuItem = this.items[0];
    //   }
    // });
   
  }
ngOnDestroy(){
this.navigationEmitterSubscription.unsubscribe();
}

  updateCurrentmentitem(menuItem){
    this.currentActiveMenuItem = menuItem;
    this.router.navigate([menuItem.navigationRoute]);
  }

}
