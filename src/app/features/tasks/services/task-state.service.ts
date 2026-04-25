import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../../../core/models/task.model';
import { TaskService } from './task.service';
import { NotificationService } from '../../../core/services/notification.service';

/**
 * CONCEPT: Service-Based State Management
 * ==========================================
 * State management is about maintaining a "single source of truth"
 * for your application data and keeping it in sync across components.
 *
 * APPROACHES (from simple to complex):
 * 1. Service + BehaviorSubject (used here) — great for small/medium apps.
 * 2. NgRx Store — Redux pattern for large, complex apps.
 * 3. NgRx ComponentStore — lightweight alternative to full NgRx.
 * 4. Akita / NGXS — other state management libraries.
 *
 * WHY service-based state:
 * - Simple to understand — it's just a service with an Observable.
 * - No extra libraries — uses built-in RxJS.
 * - Good enough for most apps.
 * - Easy to upgrade to NgRx later if needed.
 *
 * PATTERN: The state service wraps the HTTP service (TaskService)
 * and maintains a local cache of data in BehaviorSubjects. Components
 * subscribe to the state Observables rather than making HTTP calls directly.
 *
 * DATA FLOW:
 *   Component → calls TaskStateService method (e.g., addTask)
 *     → TaskStateService calls TaskService (HTTP)
 *       → On success, updates the BehaviorSubject
 *         → All subscribed components receive the new data automatically
 */
@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  /** The internal state — private so only this service can modify it */
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private selectedTaskSubject = new BehaviorSubject<Task | null>(null);

  /** Public read-only Observables for components to subscribe to */
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  selectedTask$: Observable<Task | null> = this.selectedTaskSubject.asObservable();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}

  /**
   * Load all tasks from the API and update the state.
   *
   * CONCEPT: RxJS tap Operator
   * `tap()` performs side effects without changing the emitted value.
   * Here we use it to update BehaviorSubjects after the HTTP response.
   *
   * CONCEPT: RxJS catchError Operator
   * `catchError()` intercepts errors and lets you handle them gracefully.
   * You must return an Observable — here we return an empty array as a fallback.
   */
  loadTasks(): void {
    this.loadingSubject.next(true);

    this.taskService.getTasks().pipe(
      tap(tasks => {
        this.tasksSubject.next(tasks);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.notificationService.error('Failed to load tasks. Is the API server running?');
        // Return an empty observable to complete the stream gracefully
        return [];
      })
    ).subscribe();
  }

  /** Select a task (for the detail view) */
  selectTask(id: number): void {
    this.loadingSubject.next(true);

    this.taskService.getTask(id).pipe(
      tap(task => {
        this.selectedTaskSubject.next(task);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.notificationService.error('Failed to load task details.');
        return [];
      })
    ).subscribe();
  }

  /** Add a new task and update the local state */
  addTask(payload: CreateTaskPayload): Observable<Task> {
    return this.taskService.createTask(payload).pipe(
      tap(newTask => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next([...currentTasks, newTask]);
        this.notificationService.success('Task created successfully!');
      })
    );
  }

  /** Update an existing task and sync local state */
  updateTask(id: number, changes: UpdateTaskPayload): Observable<Task> {
    return this.taskService.updateTask(id, changes).pipe(
      tap(updatedTask => {
        const currentTasks = this.tasksSubject.getValue();
        const index = currentTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          currentTasks[index] = updatedTask;
          this.tasksSubject.next([...currentTasks]); // Spread creates a new array reference
        }
        this.selectedTaskSubject.next(updatedTask);
        this.notificationService.success('Task updated successfully!');
      })
    );
  }

  /** Delete a task and remove it from local state */
  removeTask(id: number): Observable<Task> {
    return this.taskService.deleteTask(id).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next(currentTasks.filter(t => t.id !== id));
        this.notificationService.success('Task deleted successfully!');
      })
    );
  }
}
