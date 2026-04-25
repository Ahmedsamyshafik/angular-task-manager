import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse } from '../models/user.model';

/**
 * CONCEPT: Services & Dependency Injection (DI)
 * ===============================================
 * Services are classes decorated with @Injectable that encapsulate
 * reusable business logic. Angular's DI system creates a SINGLE instance
 * (singleton) when `providedIn: 'root'` is set, and shares it across
 * the entire app.
 *
 * WHY use services:
 * 1. Components should only handle UI logic — data fetching, auth state,
 *    and business rules belong in services.
 * 2. Services are easy to test in isolation (just instantiate + inject mocks).
 * 3. Multiple components can share the same service instance and its state.
 *
 * CONCEPT: providedIn: 'root'
 * ============================
 * This tells Angular to register the service at the root injector level,
 * making it a singleton available everywhere. This is the recommended
 * approach over listing services in a module's `providers` array because:
 * - It enables tree-shaking (unused services are removed from the bundle).
 * - It's simpler — no need to import the service into any module.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * CONCEPT: BehaviorSubject for State Management
   * ===============================================
   * BehaviorSubject is a special Observable that:
   * 1. Holds a "current value" (unlike regular Subject)
   * 2. Emits the current value immediately to new subscribers
   * 3. Can be updated with .next()
   *
   * WHY BehaviorSubject over Subject:
   * - When a component subscribes, it immediately gets the current auth state
   *   instead of waiting for the next change.
   * - We can read the current value synchronously via .getValue()
   *
   * PATTERN: Private BehaviorSubject + Public Observable
   * We keep the BehaviorSubject private so only this service can call .next().
   * External code reads state through the public Observable (read-only view).
   */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  /** Public read-only streams — components subscribe to these */
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  /**
   * Simulated user database — in a real app this would be an API call.
   * IMPORTANT: Never store passwords in frontend code in production!
   * This is only for educational demonstration purposes.
   */
  private readonly mockUsers: Array<User & { password: string }> = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@taskmanager.com', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', email: 'user@taskmanager.com', role: 'user' }
  ];

  constructor() {
    // Restore session from localStorage on app startup
    this.restoreSession();
  }

  /**
   * Simulates a login API call.
   *
   * CONCEPT: Observables & RxJS
   * ============================
   * We return an Observable instead of a Promise because:
   * 1. Observables are lazy — they don't execute until subscribed to.
   * 2. They can be cancelled (unsubscribe).
   * 3. They integrate with Angular's async pipe and other RxJS operators.
   *
   * CONCEPT: RxJS Operators — tap, delay
   * - `delay(800)` simulates network latency so you can see loading states.
   * - `tap()` performs side effects (saving to localStorage) without changing
   *   the emitted value. Think of it as "do this, but pass the data through."
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = this.mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      // throwError creates an Observable that immediately errors
      return throwError(() => new Error('Invalid username or password'));
    }

    const { password, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(), // Simulated JWT token
      user: userWithoutPassword
    };

    // `of()` creates an Observable that emits a single value then completes
    return of(response).pipe(
      delay(800),  // Simulate network delay
      tap(res => {
        // Side effect: persist auth state
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('current_user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /** Synchronous check — useful in guards */
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private restoreSession(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('current_user');

    if (token && userJson) {
      try {
        const user: User = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch {
        this.logout(); // Clear corrupted data
      }
    }
  }
}
