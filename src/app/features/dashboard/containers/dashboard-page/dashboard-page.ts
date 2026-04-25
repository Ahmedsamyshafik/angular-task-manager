import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task } from '../../../../core/models/task.model';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { TaskStateService } from '../../../tasks/services/task-state.service';

/**
 * CONCEPT: "Smart" (Container) Components
 * ==========================================
 * Smart components (also called "container" components):
 * - Inject services and fetch data.
 * - Manage state and coordinate child components.
 * - Pass data DOWN to dumb components via @Input.
 * - React to events FROM dumb components via @Output.
 * - Contain business logic and side effects.
 *
 * PATTERN: Smart → Dumb Data Flow
 *   DashboardPage (SMART)
 *     → fetches tasks from TaskStateService
 *     → calculates statistics
 *     → passes stats to StatCard (DUMB) via @Input
 *
 * WHY: Separation of concerns. The DashboardPage knows WHERE to get
 * data but doesn't know HOW to display stats. StatCard knows HOW to
 * display but doesn't know WHERE data comes from.
 */
@Component({
  standalone: false,
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  tasks: Task[] = [];
  private destroy$ = new Subject<void>();

  /** Computed statistics for the stat cards */
  get totalTasks(): number { return this.tasks.length; }
  get todoCount(): number { return this.tasks.filter(t => t.status === 'todo').length; }
  get inProgressCount(): number { return this.tasks.filter(t => t.status === 'in-progress').length; }
  get doneCount(): number { return this.tasks.filter(t => t.status === 'done').length; }
  get highPriorityCount(): number { return this.tasks.filter(t => t.priority === 'high').length; }

  /** Recent tasks for the dashboard table */
  get recentTasks(): Task[] {
    return [...this.tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  /**
   * CONCEPT: ChangeDetectorRef
   * Angular's change detection may not automatically pick up async
   * state updates from BehaviorSubjects in all cases. Injecting
   * ChangeDetectorRef lets us manually notify Angular when data
   * has changed so the template re-renders with the latest values.
   */
  constructor(
    private authService: AuthService,
    private taskStateService: TaskStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.currentUser = user);

    // Load tasks into state and subscribe to changes
    this.taskStateService.loadTasks();
    this.taskStateService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.cdr.detectChanges();
      });
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
