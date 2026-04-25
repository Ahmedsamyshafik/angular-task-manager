import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

// Shared Declarations
import { HighlightDirective } from './directives/highlight.directive';
import { PriorityLabelPipe } from './pipes/priority-label.pipe';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';

/**
 * CONCEPT: Shared Module
 * ========================
 * The Shared Module contains components, directives, and pipes that are
 * used across multiple feature modules. Unlike CoreModule (imported once),
 * SharedModule is imported by EVERY feature module that needs these shared items.
 *
 * KEY PATTERN: Import AND Export
 * We both import AND export modules like CommonModule and FormsModule.
 * WHY: Feature modules that import SharedModule automatically get access
 * to these modules without needing to import them individually.
 *
 * WHAT GOES HERE:
 * ✓ Reusable "dumb" components (buttons, dialogs, cards)
 * ✓ Custom directives and pipes
 * ✓ Commonly used Angular modules (CommonModule, FormsModule)
 * ✓ Angular Material module re-exports
 *
 * WHAT DOESN'T GO HERE:
 * ✗ Services (use providedIn: 'root' or CoreModule instead)
 * ✗ Feature-specific components
 */

/** Group all Material modules for clean imports */
const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatBadgeModule,
  MatDividerModule
];

@NgModule({
  declarations: [
    HighlightDirective,
    PriorityLabelPipe,
    ConfirmDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...materialModules
  ],
  exports: [
    // Re-export Angular modules so feature modules don't need to import them
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...materialModules,

    // Export shared declarations so other modules can use them
    HighlightDirective,
    PriorityLabelPipe,
    ConfirmDialog
  ]
})
export class SharedModule { }
