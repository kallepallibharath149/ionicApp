import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserPostsService } from './user-post-service/user-posts-service';
import { Subscription } from 'rxjs';
import { GlobalEmittingEventsService } from '../../services/global-emitting-events.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.less']
})
export class UserPostsComponent implements OnInit, OnDestroy {
  userDetails:any = null;
  @Input('postsArray')postsArray: Array<any> = [];
  @Input('currentGroupId')currentGroupId: any ='';
  Posts:Array<any>=[];
  globalEmmittingSubscription:Subscription;
  constructor(private userPostsService:UserPostsService,
    private globalEmitterService: GlobalEmittingEventsService) { }

  ngOnInit(): void {
    this.globalEmmittingSubscription = this.globalEmitterService.loggedInDetailsEmit.subscribe((userDetails)=>{
      if(userDetails != false){
        this.userDetails = userDetails;
      }
    });
  }

  ngOnDestroy(){
  this.globalEmmittingSubscription.unsubscribe();
  }

  identify(index, item){
    return item.id; 
 }
}
