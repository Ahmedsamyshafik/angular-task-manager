import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { Login } from './pages/login/login';

/**
 * CONCEPT: Feature Modules
 * ==========================
 * Feature modules group related components, services, and routes
 * for a specific feature area (auth, dashboard, tasks, etc.).
 *
 * WHY feature modules:
 * 1. Organization — related code lives together.
 * 2. Lazy loading — the module's code is only downloaded when the user
 *    navigates to that feature (see app-routing-module.ts).
 * 3. Encapsulation — components declared here are only available within
 *    this module unless explicitly exported.
 * 4. Team scalability — different developers can work on different features
 *    without stepping on each other's toes.
 */
@NgModule({
  declarations: [Login],
  imports: [
    SharedModule,        // Gives us CommonModule, Material components, etc.
    AuthRoutingModule    // Feature-specific routes
  ]
})
export class AuthModule { }
