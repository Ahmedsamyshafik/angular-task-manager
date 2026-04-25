import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, CreateTaskPayload } from '../../../../core/models/task.model';

/**
 * CONCEPT: Reactive Forms — Advanced Usage
 * ==========================================
 * This form component demonstrates:
 * 1. FormBuilder for creating complex forms.
 * 2. Multiple validators on a single field.
 * 3. Custom validation messages based on error type.
 * 4. Form modes (create vs edit) with dynamic initialization.
 * 5. ngOnChanges to react when @Input changes (edit mode).
 *
 * CONCEPT: ngOnChanges Lifecycle Hook
 * Called whenever an @Input property changes. Receives a SimpleChanges
 * object that tells you the previous and current values.
 * WHY: We use it to populate the form when switching to edit mode
 * (when a task is passed in via @Input).
 */
@Component({
  standalone: false,
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss']
})
export class TaskForm implements OnChanges {
  /** If a task is passed, we're in EDIT mode. Otherwise, CREATE mode. */
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<CreateTaskPayload>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;
  isEditMode = false;

  /** Options for select dropdowns */
  priorities: Array<{ value: string; label: string }> = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'high', label: '🔴 High' }
  ];

  statuses: Array<{ value: string; label: string }> = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  constructor(private fb: FormBuilder) {
    /**
     * CONCEPT: Complex Form Setup
     * Each control can have multiple validators in an array.
     * Validators run in order — the first failing validator
     * determines the error shown.
     */
    this.taskForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      priority: ['medium', Validators.required],
      status: ['todo', Validators.required],
      dueDate: ['', Validators.required],
      assignee: ['']  // Optional — no validators
    });
  }

  /**
   * CONCEPT: ngOnChanges
   * Called when ANY @Input property changes. The `changes` parameter
   * is a key-value map where keys are input property names.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.isEditMode = true;
      /**
       * patchValue() sets form values without requiring ALL fields.
       * setValue() requires ALL form fields to be provided.
       * Use patchValue() when you might not have every field.
       */
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        status: this.task.status,
        dueDate: this.task.dueDate,
        assignee: this.task.assignee || ''
      });
    } else if (changes['task'] && !this.task) {
      this.isEditMode = false;
      this.taskForm.reset({ priority: 'medium', status: 'todo' });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.taskForm.value as CreateTaskPayload);
    if (!this.isEditMode) {
      this.taskForm.reset({ priority: 'medium', status: 'todo' });
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.taskForm.reset({ priority: 'medium', status: 'todo' });
  }

  /** Helper for template access to form controls */
  get f() {
    return this.taskForm.controls;
  }
}
