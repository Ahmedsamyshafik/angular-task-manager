import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

/**
 * CONCEPT: HTTP Interceptors
 * ===========================
 * Interceptors sit between your app and the network. Every HTTP request
 * passes through them, allowing you to:
 * 1. Add headers (e.g., auth token) to every request automatically.
 * 2. Handle errors globally (e.g., redirect on 401 Unauthorized).
 * 3. Log requests, add loading spinners, retry failed requests, etc.
 *
 * WHY: Without interceptors, you'd need to add the auth token manually
 * in every service method that makes an HTTP call. Interceptors centralize
 * cross-cutting concerns.
 *
 * HOW: Interceptors form a "chain" — each interceptor calls `next.handle()`
 * to pass the request to the next interceptor (or the actual HTTP backend).
 *
 * REGISTRATION: Interceptors must be provided using the HTTP_INTERCEPTORS
 * multi-provider token (see core.module.ts).
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Intercepts every outgoing HTTP request.
   *
   * CONCEPT: Immutable Requests
   * HttpRequest objects are immutable — you can't modify them directly.
   * Instead, use `req.clone()` to create a modified copy.
   * WHY: Immutability prevents bugs from multiple interceptors accidentally
   * modifying the same request object.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Clone the request and attach the auth token if available
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    /**
     * CONCEPT: RxJS catchError Operator
     * ===================================
     * `catchError` intercepts errors in the Observable stream.
     * It receives the error and must return a new Observable:
     * - Return `throwError()` to propagate the error downstream.
     * - Return `of(fallbackValue)` to recover with a default value.
     *
     * Here we handle HTTP errors globally — show notifications
     * for common errors and redirect on 401 (session expired).
     */
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            this.notificationService.error('Session expired. Please log in again.');
            break;
          case 403:
            this.notificationService.error('You do not have permission to perform this action.');
            break;
          case 404:
            this.notificationService.error('The requested resource was not found.');
            break;
          case 500:
            this.notificationService.error('Server error. Please try again later.');
            break;
          default:
            if (error.status === 0) {
              // Network error — server unreachable
              this.notificationService.error('Unable to connect to the server. Is JSON Server running?');
            }
            break;
        }

        // Re-throw so individual services can also handle errors if needed
        return throwError(() => error);
      })
    );
  }
}
