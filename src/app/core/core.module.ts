import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiInterceptor } from './interceptors/api.interceptor';

/**
 * CONCEPT: Core Module
 * =====================
 * The Core Module holds singleton services, guards, and interceptors
 * that should be instantiated ONCE and shared across the entire app.
 *
 * RULE: Only import CoreModule in the root AppModule — never in feature modules.
 * WHY: If a lazy-loaded feature module imports CoreModule, Angular creates
 * a SECOND instance of all its services, breaking the singleton pattern.
 *
 * The constructor guard below enforces this rule at runtime.
 *
 * WHAT GOES HERE vs. SHARED MODULE:
 * - CoreModule: Singleton services, interceptors, guards (things that should
 *   exist exactly once in the app).
 * - SharedModule: Reusable components, directives, pipes (things used in
 *   multiple feature modules' templates).
 */
@NgModule({
  providers: [
    /**
     * CONCEPT: Registering HTTP Interceptors
     * ========================================
     * Interceptors use the `multi: true` pattern — this tells Angular
     * to ADD this provider to an array of existing interceptors rather
     * than REPLACING them. Multiple interceptors form a chain.
     */
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true  // IMPORTANT: `multi: true` adds to the chain instead of replacing
    }
  ]
})
export class CoreModule {
  /**
   * ADVANCED: Preventing multiple imports of CoreModule.
   *
   * @Optional() — Don't throw if CoreModule isn't already injected.
   * @SkipSelf() — Look for CoreModule in PARENT injectors, not this one.
   *
   * If `parentModule` exists, it means CoreModule was already imported
   * by a parent module (AppModule), so importing it again is a mistake.
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it ONLY in AppModule.'
      );
    }
  }
}
