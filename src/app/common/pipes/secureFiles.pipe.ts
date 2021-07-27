import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
// import { Subscriber } from 'rxjs/Subscriber';
// Subscriber

@Pipe({ name: 'SecureFIles' })
export class SecureFilesUrlPipe implements PipeTransform {
    constructor(private http: HttpClient,
                private sanitizer: DomSanitizer) { }

    transform(url: string): Observable<SafeUrl> {
        return this.http.get(url, { responseType: "blob" }).pipe(
            map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)))
        );
    }
}