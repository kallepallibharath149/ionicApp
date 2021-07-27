import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../interceptors/http.service';
import { GroupsService } from '../groups/groups.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConnectionsService {

    constructor(private groupsService: GroupsService,
        private httpClient: HttpService) { }

    getRelationShipTypes(endPoint) : Observable<any>{
        return this.httpClient.httpGet(endPoint);
    }

    getPendingInvitations(endPoint): Observable<any>{
        return this.httpClient.httpGet(endPoint);
    }

    getSentInvitations(endPoint): Observable<any>{
        return this.httpClient.httpGet(endPoint);
    }

    inviteForRelationShip(endPoint): Observable<any>{
        return this.httpClient.httpPost(endPoint);
    }

    acceptRejectInvitation(endPoint): Observable<any>{
        return this.httpClient.httpUpdate(endPoint);
    }

    getMyConnections(endPoint): Observable<any>{
        return this.httpClient.httpGet(endPoint);
    }
}
