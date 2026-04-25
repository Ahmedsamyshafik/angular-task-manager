import { Pipe, PipeTransform } from '@angular/core';

/**
 * CONCEPT: Custom Pipes
 * ======================
 * Pipes transform data for display in templates. Angular includes built-in
 * pipes (date, uppercase, currency, json, async, etc.), and you can create
 * custom ones for app-specific transformations.
 *
 * WHY use pipes instead of methods in the component:
 * 1. Pipes are PURE by default — Angular only re-evaluates them when
 *    the input value changes (reference check). Methods in templates
 *    run on EVERY change detection cycle, which hurts performance.
 * 2. Pipes are reusable across any template in the app.
 * 3. Templates stay clean: `task.priority | priorityLabel` reads better
 *    than `getPriorityLabel(task.priority)`.
 *
 * USAGE in templates:
 *   {{ task.priority | priorityLabel }}           → "🔴 High Priority"
 *   {{ task.priority | priorityLabel:'short' }}   → "🔴 High"
 *
 * PERFORMANCE TIP:
 * Keep pipes PURE (the default). A pure pipe only recalculates when its
 * input reference changes. If you set `pure: false`, the pipe recalculates
 * on every change detection cycle — avoid this unless absolutely necessary.
 */
@Pipe({
  standalone: false,
  name: 'priorityLabel',
  pure: true  // Default — shown explicitly for educational purposes
})
export class PriorityLabelPipe implements PipeTransform {

  /**
   * The `transform` method is called by Angular whenever the pipe is used.
   *
   * @param value    The input value (left side of the pipe: `task.priority`)
   * @param format   Optional argument (right side: `'short'`). Pipes can
   *                 accept multiple arguments separated by colons in templates.
   * @returns        The transformed string for display
   */
  transform(value: string, format: 'short' | 'long' = 'long'): string {
    const labels: Record<string, { icon: string; short: string; long: string }> = {
      high:   { icon: '🔴', short: 'High',   long: 'High Priority'   },
      medium: { icon: '🟡', short: 'Medium', long: 'Medium Priority' },
      low:    { icon: '🟢', short: 'Low',    long: 'Low Priority'    }
    };

    const label = labels[value];
    if (!label) {
      return value; // Return the raw value if priority is unrecognized
    }

    return `${label.icon} ${label[format]}`;
  }
}
