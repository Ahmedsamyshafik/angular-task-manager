import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

/**
 * CONCEPT: App-Level Routing with Lazy Loading
 * ===============================================
 * This is the ROOT routing configuration. It defines the top-level routes
 * and sets up lazy loading for feature modules.
 *
 * CONCEPT: Lazy Loading with loadChildren
 * ==========================================
 * Instead of importing feature modules eagerly (which bundles ALL code
 * into one large file), we use `loadChildren` with dynamic import().
 *
 * HOW IT WORKS:
 * 1. On initial load, ONLY the code for the current route is downloaded.
 * 2. When the user navigates to /dashboard for the first time, Angular
 *    downloads the DashboardModule chunk (a separate JS file).
 * 3. Subsequent visits to /dashboard use the cached chunk.
 *
 * WHY:
 * - Faster initial load time (smaller initial bundle).
 * - Users only download code for features they actually visit.
 * - Critical for large applications with many features.
 *
 * SYNTAX: `loadChildren: () => import('./path').then(m => m.ModuleName)`
 * The `import()` function returns a Promise that resolves to the module.
 * `.then(m => m.ModuleName)` extracts the specific NgModule class.
 *
 * CONCEPT: canActivate Guard
 * The `canActivate: [AuthGuard]` property tells Angular to run AuthGuard
 * before allowing navigation to this route. If the guard returns false
 * or a UrlTree (redirect), navigation is blocked.
 */
const routes: Routes = [
  // Default route — redirect to dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'  // Must match the ENTIRE URL, not just a prefix
  },

  // Auth routes — no guard needed (anyone can access login)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Dashboard — protected by AuthGuard, lazy loaded
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]  // Must be logged in to access
  },

  // Tasks — protected by AuthGuard, lazy loaded
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [AuthGuard]  // Must be logged in to access
  },

  // Wildcard route — catches any undefined URL and redirects to dashboard
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
