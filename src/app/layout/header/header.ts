import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

/**
 * CONCEPT: Component Lifecycle Hooks
 * ====================================
 * Angular components go through a lifecycle:
 * 1. constructor    — DI happens here. Don't do heavy work.
 * 2. ngOnChanges    — Called when @Input properties change.
 * 3. ngOnInit       — Called once after the first ngOnChanges. Use for initialization.
 * 4. ngDoCheck      — Called on every change detection run.
 * 5. ngAfterViewInit — Called after the component's view is initialized.
 * 6. ngOnDestroy    — Called right before the component is removed. Clean up here!
 *
 * CONCEPT: Unsubscribing from Observables (Memory Leak Prevention)
 * ==================================================================
 * When you subscribe to an Observable in a component, you MUST unsubscribe
 * when the component is destroyed. Otherwise, the subscription keeps running
 * (memory leak) and may cause errors on destroyed components.
 *
 * PATTERN: takeUntil + Subject (Recommended)
 * 1. Create a `destroy$` Subject.
 * 2. Pipe all subscriptions through `takeUntil(this.destroy$)`.
 * 3. In ngOnDestroy, call `this.destroy$.next()` — this completes all
 *    subscriptions that use takeUntil.
 *
 * Alternative: Use the `async` pipe in templates — it auto-unsubscribes.
 */
@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAuthenticated = false;

  /** Used to clean up subscriptions — see the takeUntil pattern above */
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.currentUser = user);

    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => this.isAuthenticated = isAuth);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  /** Clean up all subscriptions when component is destroyed */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
