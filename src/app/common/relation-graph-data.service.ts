import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RelationGraphDataService {

  neo4jData = {
    'nodes': [
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d10',
        'url': 'http://3.230.104.70:8888/images/flower1.jpg',
        'properties': {
          'any': 'Project1'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d20',
        'url': 'http://3.230.104.70:8888/images/flower2.jpg',
        'properties': {
          'any': 'Project2'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d30',
        'url': 'http://3.230.104.70:8888/images/flower3.jpg',
        'properties': {
          'any': 'Project2'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d40',
        'url': 'http://3.230.104.70:8888/images/flower4.jpg',
        'properties': {
          'any': 'Project2'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d50',
        'url': 'http://3.230.104.70:8888/images/flower5.jpg',
        'properties': {
          'any': 'Project2'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d60',
        'url': 'http://3.230.104.70:8888/images/flower6.jpg',
        'properties': {
          'any': 'Project2'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d21',
        'url': 'http://3.230.104.70:8888/images/flower7.jpg',
        'properties': {
          'any': 'Project2'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d51',
        'url': 'http://3.230.104.70:8888/images/flower8.jpg',
        'properties': {
          'any': 'Project2'
        }
      },
      {
        'nodeID': 'bdfedf8e-f864-459f-b190-c32dba168d61',
        'url': 'http://3.230.104.70:8888/images/flower9.jpg',
        'properties': {
          'any': 'Project2'
        }
      }
    ],
    'relationships': [
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d12',
        'relation': 'friend',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d10',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d20',
        'properties': {
          'any': 'Project1_way'
        }
      },
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d13',
        'relation': 'brother',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d10',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d30',
        'properties': {
          'any': 'Project1_way'
        }
      },
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d14',
        'relation': 'sister',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d10',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d40',
        'properties': {
          'any': 'Project2_way'
        }
      },
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d15',
        'relation': 'friend',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d10',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d50',
        'properties': {
          'any': 'Project1_way'
        }
      },
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d16',
        'relation': 'father',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d10',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d60',
        'properties': {
          'any': 'Project1_way'
        }
      },
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d21',
        'relation': 'friend',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d20',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d21',
        'properties': {
          'any': 'Project1_way'
        }
      },
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d51',
        'relation': 'friend',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d50',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d51',
        'properties': {
          'any': 'Project1_way'
        }
      },
      {
        'id': 'rdfedf8e-f864-459f-b190-c32dba168d61',
        'relation': 'friend',
        'startNode': 'bdfedf8e-f864-459f-b190-c32dba168d60',
        'endNode': 'bdfedf8e-f864-459f-b190-c32dba168d61',
        'properties': {
          'any': 'Project1_way'
        }
      }
    ]
  };

  constructor() { }

  getLocalNeo4jData() {
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(this.neo4jData);
        observer.complete();
      }, 1000);
    });
    return observable;
  }
}
