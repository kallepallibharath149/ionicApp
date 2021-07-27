import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';
import { ApiService } from './common/api.service.service';
//  DragulaModule
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedServiceModule } from './common/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from './common/ngx-loader/lib/ngx-loading.module';
import { MessageService } from 'primeng/api';
import { GlobalEmittingEventsService } from './services/global-emitting-events.service';
import { UserPostsService } from './posts/user-posts/user-post-service/user-posts-service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { LoginServiceService } from './login/login-service.service';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './app-route-reuse.strategy';
import { HttpService } from './interceptors/http.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiPrefixInterceptor } from './interceptors/api.prefix.interceptor';
import { GroupsService } from './groups/groups.service';
import { GroupVideoPauseService } from './services/group.video.pause.service';
import { groupPostReloadService } from './main-home-page/main-page-groups-container/groupPost.reload';
import { CustomPreloadingService } from './services/custom.preloading.service';
import { EventsService } from './services/events.service';
import { ConnectionsService } from './services/connections.service';
import { GlobalNavigateService } from './services/global.navigate.service';
import { UserEventsService } from './services/user.event.service';
import { NgNeo4jd3Service } from 'ng-neo4jd3';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    // NgbModule,
    SharedServiceModule,
    DragulaModule.forRoot(),
    NgxLoadingModule.forRoot({}),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },
    HttpService,
    GroupsService,
    EventsService,
    GlobalNavigateService,
    UserEventsService,
    groupPostReloadService,
    GroupVideoPauseService,
    GlobalEmittingEventsService,
    LoginServiceService,
    UserPostsService,
    ConnectionsService,
    CustomPreloadingService,
    ApiService,
    MessageService,
    NgbActiveModal,
    NgNeo4jd3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
