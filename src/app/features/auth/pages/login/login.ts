import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * CONCEPT: Reactive Forms
 * ========================
 * Angular offers two approaches to forms:
 *
 * 1. REACTIVE FORMS (used here — recommended for complex forms):
 *    - Form structure defined in the component class (TypeScript).
 *    - Programmatic access to form values, validation, and state.
 *    - Easier to test because logic is in the class, not the template.
 *    - Uses FormGroup, FormControl, FormArray, and Validators.
 *
 * 2. TEMPLATE-DRIVEN FORMS (see task-quick-add component):
 *    - Form structure defined in the template (HTML).
 *    - Uses ngModel for two-way data binding.
 *    - Simpler for small, straightforward forms.
 *    - Harder to test because logic is in the template.
 *
 * KEY CLASSES:
 * - FormGroup:   A collection of FormControls. Groups fields together.
 * - FormControl: Tracks the value and validation state of a single input.
 * - FormBuilder: A helper service that reduces boilerplate when creating forms.
 * - Validators:  Built-in validation functions (required, minLength, email, etc.).
 */
@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  /** The reactive form group — contains all form controls */
  loginForm: FormGroup;

  /** UI state */
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    /**
     * CONCEPT: FormBuilder.group()
     * Creates a FormGroup with named controls. Each control gets:
     * 1. An initial value (first element or just the value)
     * 2. An array of validators (second element)
     *
     * Validators.required — the field must have a value.
     * Validators.minLength(3) — the value must be at least 3 characters.
     *
     * You could also create controls manually:
     *   new FormGroup({
     *     username: new FormControl('', [Validators.required]),
     *     ...
     *   })
     * FormBuilder is just a convenience wrapper.
     */
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * Called when the form is submitted.
   *
   * CONCEPT: Form Validation State
   * - form.valid:    All validators pass.
   * - form.invalid:  At least one validator fails.
   * - form.dirty:    The user has changed at least one field.
   * - form.touched:  The user has focused and left at least one field.
   * - form.value:    An object with all form field values.
   * - form.get('fieldName'):  Access a specific FormControl.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.notificationService.success('Login successful! Welcome back.');
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.notificationService.error(err.message);
      }
    });
  }

  /**
   * Helper to access form controls in the template.
   * Usage in template: loginForm.get('username')  or  f['username']
   * WHY: Avoids verbose template expressions.
   */
  get f() {
    return this.loginForm.controls;
  }
}
