import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task, CreateTaskPayload } from '../../../../core/models/task.model';
import { TaskStateService } from '../../services/task-state.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

/**
 * CONCEPT: Smart Container Component — Task List
 * =================================================
 * This is the main "smart" component for the tasks feature.
 * It coordinates between:
 * - TaskStateService (data source)
 * - TaskCard (dumb component — displays individual tasks)
 * - TaskForm (dumb component — create/edit form)
 * - TaskQuickAdd (dumb component — quick add form)
 * - ConfirmDialog (shared component — delete confirmation)
 *
 * RESPONSIBILITIES:
 * 1. Subscribes to task state and loading state.
 * 2. Handles CRUD actions by calling TaskStateService methods.
 * 3. Manages UI state (which task is being edited, filters).
 * 4. Passes data down to child components via @Input.
 * 5. Handles events from child components via @Output.
 */
@Component({
  standalone: false,
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskList implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = false;
  showForm = false;
  editingTask: Task | null = null;

  /** Filter state */
  statusFilter: string = 'all';
  priorityFilter: string = 'all';

  private destroy$ = new Subject<void>();

  constructor(
    private taskStateService: TaskStateService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load tasks from API
    this.taskStateService.loadTasks();

    // Subscribe to state changes
    this.taskStateService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.applyFilters();
        this.cdr.detectChanges();
      });

    this.taskStateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
        this.cdr.detectChanges();
      });
  }

  /** Filter tasks based on selected status and priority */
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatus = this.statusFilter === 'all' || task.status === this.statusFilter;
      const matchesPriority = this.priorityFilter === 'all' || task.priority === this.priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onPriorityFilterChange(priority: string): void {
    this.priorityFilter = priority;
    this.applyFilters();
  }

  /** Show the create form */
  onShowCreateForm(): void {
    this.editingTask = null;
    this.showForm = true;
  }

  /** Handle save from the form (create or update) */
  onSaveTask(payload: CreateTaskPayload): void {
    if (this.editingTask) {
      // UPDATE existing task
      this.taskStateService.updateTask(this.editingTask.id, {
        ...this.editingTask,
        ...payload
      }).subscribe(() => {
        this.showForm = false;
        this.editingTask = null;
      });
    } else {
      // CREATE new task
      this.taskStateService.addTask(payload).subscribe(() => {
        this.showForm = false;
      });
    }
  }

  /** Handle quick add from the template-driven form */
  onQuickAdd(payload: CreateTaskPayload): void {
    this.taskStateService.addTask(payload).subscribe();
  }

  /** Switch to edit mode for a specific task */
  onEditTask(task: Task): void {
    this.editingTask = task;
    this.showForm = true;
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Delete a task after confirmation */
  onDeleteTask(taskId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.taskStateService.removeTask(taskId).subscribe();
      }
    });
  }

  /** Handle status change from task card */
  onStatusChange(event: { id: number; status: Task['status'] }): void {
    const task = this.tasks.find(t => t.id === event.id);
    if (task) {
      this.taskStateService.updateTask(event.id, { ...task, status: event.status }).subscribe();
    }
  }

  /** Cancel form editing */
  onCancelForm(): void {
    this.showForm = false;
    this.editingTask = null;
  }

  /**
   * PERFORMANCE TIP: trackBy Function
   * Pass this to *ngFor to help Angular identify which items changed.
   * Without trackBy, Angular destroys and recreates ALL list items
   * whenever the array reference changes (e.g., after filtering).
   */
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
