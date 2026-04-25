import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Header } from './header/header';

/**
 * Layout Module — contains structural components like the header,
 * sidebar, and footer. These components form the app's "shell"
 * and are used in the root AppComponent template.
 */
@NgModule({
  declarations: [Header],
  imports: [SharedModule],
  exports: [Header]  // Export so AppModule can use <app-header> in its template
})
export class LayoutModule { }
