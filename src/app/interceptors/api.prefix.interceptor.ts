import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { authNotrequiredAPI } from './../common/global.constants';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class ApiPrefixInterceptor implements HttpInterceptor {
    authNotrequiredAPI: Array<any> = authNotrequiredAPI;
    constructor(private authService: AuthService,
        private router: Router,
        public messageService: MessageService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let url = request.url;
        let authRequired = this.checkAuthRequiredAPI(url);
        if (authRequired) {
            if ("authDetails" in localStorage) {
                let authDetails = JSON.parse(localStorage.getItem("authDetails"));
                if (authDetails['token']) {
                    request = request.clone({
                        setHeaders: {
                            'Authorization': authDetails['token']
                        }
                    });
                } else {
                    this.authService.logOutUser();
                    return throwError(of(['']));
                }
            } else {
                this.authService.logOutUser();
                return throwError(of(['']));
            }
        }

        return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 401:
                        return this.handle401Error(request, next, error);
                    case 500:
                        return this.handle500Error(error);
                    default:
                        return this.handleOtherError(error);
                }
            } else {
                return this.handleOtherError(error);
            }
        }));
    }

    handleOtherError(error) {
        if(this.authService.getCurrentOnlineState() == 'offline'){
         this.messageService.add({ id: 2, severity: 'error', life: 1000000000, summary: 'Error Message', detail: 'You are offine. Please check your connection...' });   
         return throwError('');
        } 
        if (error && error?.error?.StatusCode === 500) {
            return this.handle500Error(error);
        }
        let errorMessage = '';
        let errorType = "error";
        if (error.error instanceof ErrorEvent) {
            // client-side error
        } else {
            // server-side error
            // checking back-end hadled or not error handling for showing error , warn , info messages
            let errorHandlingCheck;
            if (error.error && error.error != null && typeof (error.error) == "object") {
                let errorKeys = Object.keys(error.error);
                errorHandlingCheck = errorKeys.findIndex(item => {
                    if (item == 'error' || item == 'warning' || item == 'info') {
                        return true;
                    } else {
                        return false;
                    }
                });

                // if back end error handling then showing respective banner with error message
                if (errorHandlingCheck >= 0) {
                    for (let i = 0; i < errorKeys.length; i++) {
                        let message = error.error[errorKeys[i]].join('\n');
                        if (errorKeys[i] == 'error') {
                            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: message, closable: true });
                        } else if (errorKeys[i] == 'warning') {
                            message = error.error[errorKeys[i]].join("\r\n");
                            this.messageService.add({ severity: 'warn', summary: 'Warn Message', detail: message, closable: true });
                        } else if (errorKeys[i] == 'info') {
                            this.messageService.add({ severity: 'info', summary: 'Info Message', detail: message, closable: true });
                        }
                    }
                } else {// old backend error handling only message in error object
                    let checkUnkonwnError:boolean =false;
                    if (error.error && error.error.message) {
                        errorMessage = error.error.message;
                        if (error.error.errorType) {
                            errorType = error.error.errorType;
                        }
                    } else {
                        checkUnkonwnError = true;
                        errorMessage = 'Something went wrong! Please check with technical support!';  
                    }
                    switch (errorType) {
                        case "error":
                            if(checkUnkonwnError){
                                this.messageService.add({ severity: 'error', life: 10000, summary: 'Error Message', detail: errorMessage, closable: true });
                            } else {
                                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: errorMessage, closable: true });   
                            }
                            
                            break;
                        case "info":
                            this.messageService.add({ severity: 'info', summary: 'Info Message', detail: errorMessage, closable: true });
                            break;
                        case "warn":
                            this.messageService.add({ severity: 'warn', summary: 'Warn Message', detail: errorMessage, closable: true });
                            break;
                    }
                }
            } else { // no error handling from Back-End then showing generic error from response
                if (error.error) {
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: errorMessage, closable: true });
                }
            }
        }
        return throwError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler, error) {
        // un-uthorized request either timeout or un-uthorized need to logout and redirect to login page 
        this.messageService.add({ severity: 'info', summary: 'Info Message', detail: 'Session time out!. Please login again', closable: true });
        this.authService.logOutUser();
        return throwError(error)
    }

    handle500Error(error) {
        this.messageService.add({ severity: 'error', summary: '', life: 10000, detail: 'Something went wrong! Please check with technical support!', closable: true });
        return throwError(error);
    }

    checkAuthRequiredAPI(url: string): boolean {
        let status = false;
        this.authNotrequiredAPI.forEach(APIName => {
            if (url.indexOf(APIName) >= 0) {
                status = true;
            }
        });
        return !status;
    }
}