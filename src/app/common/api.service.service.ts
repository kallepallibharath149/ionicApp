import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getNodes(id?: string){
    let url ='http://3.230.104.70:8888/api/nodes';
    url = id ? `${url}/${id}` : url;
    return this.http.get(url);
  }
  addNodes(payload){
    return this.http.post('http://3.230.104.70:8888/api/nodes', payload);
  }
}
