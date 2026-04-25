import { Component, EventEmitter, Output } from '@angular/core';
import { CreateTaskPayload } from '../../../../core/models/task.model';

/**
 * CONCEPT: Template-Driven Forms
 * ================================
 * Template-driven forms define the form structure IN THE TEMPLATE using
 * directives like ngModel, ngForm, required, minlength, etc.
 *
 * COMPARISON: Template-Driven vs Reactive Forms
 * ┌──────────────────┬──────────────────────┬─────────────────────┐
 * │ Feature          │ Template-Driven      │ Reactive            │
 * ├──────────────────┼──────────────────────┼─────────────────────┤
 * │ Form model       │ Template (HTML)       │ Component class (TS)│
 * │ Data binding     │ Two-way (ngModel)     │ FormControl objects │
 * │ Validation       │ Template directives   │ Validator functions │
 * │ Testing          │ Harder (needs DOM)    │ Easier (pure TS)    │
 * │ Complexity       │ Simple forms          │ Complex forms       │
 * │ Dynamic fields   │ Harder               │ Easy (FormArray)    │
 * └──────────────────┴──────────────────────┴─────────────────────┘
 *
 * USE TEMPLATE-DRIVEN WHEN:
 * - The form is simple (few fields, basic validation).
 * - You want quick setup with minimal TypeScript.
 *
 * USE REACTIVE WHEN:
 * - Complex validation logic.
 * - Dynamic form fields (add/remove at runtime).
 * - You need programmatic access to form state.
 *
 * CONCEPT: Two-Way Data Binding [(ngModel)]
 * [(ngModel)] is Angular's "banana-in-a-box" syntax (the banana is the
 * parentheses, the box is the square brackets).
 * It combines:
 *   [ngModel]="property"        ← Property binding (model → view)
 *   (ngModelChange)="property=$event"  ← Event binding (view → model)
 * Into one shorthand: [(ngModel)]="property"
 */
@Component({
  standalone: false,
  selector: 'app-task-quick-add',
  templateUrl: './task-quick-add.html',
  styleUrls: ['./task-quick-add.scss']
})
export class TaskQuickAdd {
  @Output() quickAdd = new EventEmitter<CreateTaskPayload>();

  /**
   * CONCEPT: Two-Way Binding Model
   * These properties are bound to form inputs via [(ngModel)].
   * When the user types, these properties update automatically.
   * When we change these properties in code, the inputs update too.
   */
  title = '';
  priority: 'low' | 'medium' | 'high' = 'medium';

  /**
   * Called when the template-driven form is submitted.
   * The template uses `#quickForm="ngForm"` to get a reference
   * to the NgForm directive, which tracks validation state.
   */
  onSubmit(): void {
    if (!this.title.trim()) return;

    const task: CreateTaskPayload = {
      title: this.title.trim(),
      description: 'Quick task — click edit to add details',
      priority: this.priority,
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
      assignee: ''
    };

    this.quickAdd.emit(task);

    // Reset the form
    this.title = '';
    this.priority = 'medium';
  }
}
