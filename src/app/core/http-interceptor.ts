import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor as AngularHttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, retry, retryWhen, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth-service';
import { ResponseItem, TokenRes } from './interfaces';


@Injectable()
export class HttpInterceptor implements AngularHttpInterceptor {
  authService = inject(AuthService);
  ctr = 0;

  intercept(req: HttpRequest<Blob | string | FormData | object>, next: HttpHandler): Observable<HttpEvent<Blob | string | FormData | object>> {
    let requestWithHeader = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.authService.getAccessToken() ?? ''}`)


    });

    if (req.url.includes('document-library-sk')) {// remove token for s3 file upload request
      requestWithHeader = requestWithHeader.clone({
        headers: requestWithHeader.headers.delete('Authorization')
      });
    }

    return next.handle(requestWithHeader).pipe(
      retryWhen(errors =>
        errors.pipe(
          switchMap((error, index) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return throwError(() => error);
            }
            if (index < 1) {
              return of(error);
            }
            return throwError(() => error);
          })
        )
      ),
      tap({
        next: (event: HttpEvent<Blob | string | FormData | object>): void => {
          if (event instanceof HttpResponse) {
            console.log('Response intercepted:', event);
          }
        },
        error: (error: Error): void => {
          if (error instanceof HttpErrorResponse && error.status === 401 && this.ctr != 1) {

            if (this.authService.getRefreshToken() == undefined) {
              this.authService.logout();
              return;
            }

            this.ctr++;
            this.authService.refresh(this.authService.getRefreshToken()).subscribe({
              next: (res: ResponseItem<TokenRes>): void => {
                this.authService.accessTokenValue = res?.data?.accessToken;
                this.authService.refreshTokenValue = res?.data?.refreshToken;
              },
              error: (err: Error): void => {
                this.authService.logout();
              }
            });
          }

          console.error('Error intercepted:', error);
        }
      })
    );
  }
}
