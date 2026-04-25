import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Task, CreateTaskPayload } from '../../../../core/models/task.model';
import { TaskStateService } from '../../services/task-state.service';

/**
 * CONCEPT: Route Parameters & switchMap
 * ========================================
 * This component demonstrates:
 * 1. Reading route parameters (the :id from /tasks/:id).
 * 2. Using switchMap to chain an Observable of route params into an
 *    Observable of task data.
 *
 * CONCEPT: ActivatedRoute
 * ActivatedRoute provides access to the current route's information:
 * - params:     Observable of route parameters (/tasks/:id → { id: '5' })
 * - queryParams: Observable of query parameters (/tasks?sort=date → { sort: 'date' })
 * - data:       Observable of resolved data
 * - fragment:   Observable of the URL fragment (#section)
 *
 * CONCEPT: RxJS switchMap Operator
 * switchMap maps each emission to a new Observable, CANCELLING
 * any previous inner Observable. This is crucial for route params:
 * If the user navigates from /tasks/1 to /tasks/2 quickly, switchMap
 * cancels the HTTP request for task 1 and only returns task 2.
 *
 * Compare with other mapping operators:
 * - mergeMap: runs all inner Observables concurrently (no cancellation).
 * - concatMap: queues inner Observables (waits for each to complete).
 * - exhaustMap: ignores new emissions until the current one completes.
 */
@Component({
  standalone: false,
  selector: 'app-task-detail',
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.scss']
})
export class TaskDetail implements OnInit, OnDestroy {
  task: Task | null = null;
  isLoading = false;
  isEditing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskStateService: TaskStateService
  ) {}

  ngOnInit(): void {
    /**
     * CONCEPT: switchMap in Action
     *
     * this.route.params emits an object like { id: '5' } every time
     * the route changes. We pipe it through switchMap to:
     * 1. Extract the id from params.
     * 2. Call selectTask() which triggers an HTTP request.
     * 3. If the user navigates to a different task before the request
     *    completes, switchMap cancels the old request automatically.
     */
    this.route.params.pipe(
      switchMap(params => {
        const id = Number(params['id']);
        this.taskStateService.selectTask(id);
        return this.taskStateService.selectedTask$;
      }),
      takeUntil(this.destroy$)
    ).subscribe(task => {
      this.task = task;
    });

    this.taskStateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onSave(payload: CreateTaskPayload): void {
    if (this.task) {
      this.taskStateService.updateTask(this.task.id, {
        ...this.task,
        ...payload
      }).subscribe(() => {
        this.isEditing = false;
      });
    }
  }

  onCancelEdit(): void {
    this.isEditing = false;
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
