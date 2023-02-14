import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
  } from '@angular/common/http';import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(public router: Router ) {
        // this.checking();
      }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = localStorage.getItem('currentusertoken');
        const stripeToken = 'sk_test_xKv5pfjEBtFt7bXwGojsFcBL001rm9yvXd';
        // let thirdParty = localStorage.getItem('thirdParty');
        if (request.url.includes('stripe.com')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${stripeToken}`
                }
            });
        } else if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser}`
                }
            });
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                // console.log('event--->>>', event);
                // this.errorDialogService.openDialog(event);
              }
              return event;
            }),
            catchError((error: HttpErrorResponse) => {
              let data = {};
              data = {
                reason: error && error.error.reason ? error.error.reason : '',
                status: error.status
              };
              // Show Error
              // this.checking();
              console.log(error);
              if (error.status === 401 || error.error === 'Unauthorized') {
                localStorage.removeItem('currentusertoken');
                localStorage.clear();
                this.router.navigate(['/home']);
              }
              // this.errorDialogService.openDialog(data);
              return throwError(error);
            }));
    }
}
