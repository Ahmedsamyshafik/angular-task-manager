import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';

/**
 * CONCEPT: Feature Routing Modules
 * ==================================
 * Each feature module has its own routing module that defines routes
 * specific to that feature. These routes are loaded via `loadChildren`
 * in the app-routing-module (lazy loading).
 *
 * Notice we use `RouterModule.forChild()` here, NOT `forRoot()`.
 * - forRoot(): Used ONCE in AppRoutingModule — sets up the Router service.
 * - forChild(): Used in feature modules — only registers routes, doesn't
 *   create a new Router instance.
 */
const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
