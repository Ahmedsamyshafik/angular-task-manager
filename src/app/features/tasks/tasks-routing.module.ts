import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskList } from './containers/task-list/task-list';
import { TaskDetail } from './containers/task-detail/task-detail';

/**
 * CONCEPT: Child Routes
 * =======================
 * Feature routing modules define routes relative to their parent path.
 * Since the app-routing-module loads this module at `path: 'tasks'`,
 * the routes below become:
 * - '' → /tasks (task list)
 * - ':id' → /tasks/5 (task detail)
 *
 * CONCEPT: Route Parameters (:id)
 * `:id` is a dynamic route parameter. Angular extracts the actual value
 * and makes it available via ActivatedRoute.params.
 * Example: /tasks/42 → params = { id: '42' }
 */
const routes: Routes = [
  { path: '', component: TaskList },
  { path: ':id', component: TaskDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
