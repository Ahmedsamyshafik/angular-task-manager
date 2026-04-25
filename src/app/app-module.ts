import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { App } from './app';

/**
 * CONCEPT: The Root AppModule
 * =============================
 * Every Angular application has one root module — AppModule.
 * It bootstraps the root component (App) and imports the modules
 * needed at startup.
 *
 * MODULE HIERARCHY:
 *   AppModule (root)
 *   ├── BrowserModule       — Essential browser-specific services (DOM rendering).
 *   │                         Only import in AppModule, never in feature modules.
 *   │                         Feature modules use CommonModule instead.
 *   ├── BrowserAnimationsModule — Enables Angular animations (required by Material).
 *   ├── CoreModule           — Singleton services, interceptors, guards.
 *   │                         Imported ONCE here (see CoreModule's guard).
 *   ├── LayoutModule         — App shell (header, footer).
 *   ├── AppRoutingModule     — Root routes (lazy loads feature modules).
 *   └── Feature Modules      — Lazy loaded on demand (not imported here).
 *       ├── AuthModule
 *       ├── DashboardModule
 *       └── TasksModule
 *
 * CONCEPT: @NgModule Metadata
 * - declarations: Components, directives, and pipes that BELONG to this module.
 * - imports: Other modules whose exported components/directives/pipes we need.
 * - providers: Services available to this module's injector.
 * - bootstrap: The root component that Angular creates and inserts into index.html.
 */
@NgModule({
  declarations: [
    App  // Root component — only declared here, in the root module
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,       // Singleton services — only imported here!
    LayoutModule,     // App shell (header)
    AppRoutingModule  // Must be last — route order matters
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]   // App is the first component Angular renders
})
export class AppModule { }
