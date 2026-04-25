import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../core/models/task.model';

/**
 * CONCEPT: @Output() and EventEmitter
 * ======================================
 * While @Input passes data DOWN (parent → child), @Output sends
 * events UP (child → parent) using EventEmitter.
 *
 * EventEmitter<T> is a typed event stream:
 * - In the child: `this.edit.emit(task)` fires the event with data.
 * - In the parent template: `(edit)="onEdit($event)"` handles the event.
 *   `$event` is the emitted value (the task object).
 *
 * WHY: Dumb components don't know what to do with events (e.g., "delete").
 * They just tell the parent "hey, the user clicked delete on this task"
 * and let the smart parent handle the actual deletion logic.
 *
 * This is a "dumb" component — it displays a task card and emits
 * events when the user wants to edit, delete, or view details.
 */
@Component({
  standalone: false,
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.scss']
})
export class TaskCard {
  /** Data flows IN via @Input */
  @Input() task!: Task;  // The `!` (definite assignment) tells TS "this will be set before use"

  /** Events flow OUT via @Output */
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{ id: number; status: Task['status'] }>();

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  /** Quick status toggle */
  onStatusChange(newStatus: Task['status']): void {
    this.statusChange.emit({ id: this.task.id, status: newStatus });
  }

  /** Returns a CSS class name based on status */
  getStatusClass(): string {
    return `status-${this.task.status}`;
  }
}
