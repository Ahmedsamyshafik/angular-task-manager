import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';

// Smart (Container) Components
import { TaskList } from './containers/task-list/task-list';
import { TaskDetail } from './containers/task-detail/task-detail';

// Dumb (Presentational) Components
import { TaskCard } from './components/task-card/task-card';
import { TaskForm } from './components/task-form/task-form';
import { TaskQuickAdd } from './components/task-quick-add/task-quick-add';

/**
 * CONCEPT: Feature Module Structure
 * ====================================
 * This module encapsulates everything related to task management:
 * - Components (both smart and dumb)
 * - Routing for the tasks feature
 * - SharedModule provides common utilities
 *
 * Services (TaskService, TaskStateService) are NOT listed here because
 * they use `providedIn: 'root'` — Angular registers them automatically.
 *
 * LAZY LOADING: This entire module (and all its components) is only
 * downloaded when the user navigates to /tasks for the first time.
 * See app-routing-module.ts for the loadChildren configuration.
 */
@NgModule({
  declarations: [
    // Smart components (manage state and coordinate children)
    TaskList,
    TaskDetail,

    // Dumb components (pure display and event emission)
    TaskCard,
    TaskForm,
    TaskQuickAdd
  ],
  imports: [
    SharedModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
