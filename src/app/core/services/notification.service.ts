import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * CONCEPT: Wrapping Third-Party Libraries in Services
 * =====================================================
 * Instead of using MatSnackBar directly in every component, we wrap it
 * in a service. This provides:
 * 1. A single place to change notification behavior (e.g., switch from
 *    snackbar to toast library without touching any component).
 * 2. Consistent default configuration across the app.
 * 3. Easier testing — mock NotificationService instead of MatSnackBar.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
