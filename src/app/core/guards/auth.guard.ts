import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * CONCEPT: Route Guards
 * ======================
 * Guards control access to routes. Angular checks guards BEFORE navigating.
 * There are several guard types:
 * - CanActivate:    Can the user navigate TO this route?
 * - CanDeactivate:  Can the user navigate AWAY from this route?
 * - CanLoad:        Can this lazy-loaded module be loaded at all?
 * - Resolve:        Fetch data BEFORE the route activates.
 *
 * WHY: Without guards, users could type a URL directly and access pages
 * they shouldn't see (e.g., admin dashboard without logging in).
 *
 * HOW IT WORKS:
 * 1. Route config says: `canActivate: [AuthGuard]`
 * 2. Angular calls this guard's `canActivate()` method before navigation.
 * 3. If it returns `true`, navigation proceeds.
 * 4. If it returns a `UrlTree`, Angular redirects to that URL instead.
 *
 * NOTE: Angular 15+ introduced functional guards (plain functions instead of
 * classes). We use the class-based approach here because it's more explicit
 * and easier to understand for beginners. Both approaches are valid.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Called by the router before activating a guarded route.
   *
   * CONCEPT: Returning Observable<boolean | UrlTree>
   * Angular's router understands Observables — it will wait for the
   * Observable to emit before deciding whether to allow navigation.
   *
   * Returning a UrlTree (instead of `false`) tells the router WHERE
   * to redirect, which is better UX than just blocking navigation.
   */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      take(1),  // Only take the current value, then complete
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;  // Allow navigation
        }

        // Redirect to login page if not authenticated
        return this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}
