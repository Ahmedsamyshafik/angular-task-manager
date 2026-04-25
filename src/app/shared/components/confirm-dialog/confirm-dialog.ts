import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * CONCEPT: Reusable Shared Components
 * =====================================
 * Components placed in the SharedModule are generic and reusable.
 * This dialog can confirm any destructive action (delete, discard, etc.)
 * across the entire app.
 *
 * CONCEPT: @Inject and Injection Tokens
 * MAT_DIALOG_DATA is an "injection token" — a unique identifier that
 * Angular's DI uses to look up a value. When you open a dialog with
 * `dialog.open(Component, { data: {...} })`, Angular makes that data
 * available via the MAT_DIALOG_DATA token.
 */
@Component({
  standalone: false,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {
  constructor(
    /** Reference to this dialog instance — used to close it and return a result */
    public dialogRef: MatDialogRef<ConfirmDialog>,
    /** Data passed when opening the dialog via dialog.open() */
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
