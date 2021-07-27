import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Pipe({ name: 'timeAgo' })

export class TimeAgo implements PipeTransform {
    constructor() { }

    transform(time: any):any {
        return moment(time).fromNow();
    }
}