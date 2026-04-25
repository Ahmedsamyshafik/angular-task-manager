import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './containers/dashboard-page/dashboard-page';
import { StatCard } from './components/stat-card/stat-card';

@NgModule({
  declarations: [
    DashboardPage,  // Smart (container) component
    StatCard        // Dumb (presentational) component
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
