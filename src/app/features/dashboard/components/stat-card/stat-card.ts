import { Component, Input } from '@angular/core';

/**
 * CONCEPT: "Dumb" (Presentational) Components
 * ==============================================
 * Dumb components (also called "presentational" components):
 * - Receive data through @Input() properties.
 * - Emit events through @Output() EventEmitter.
 * - Do NOT fetch data, call services, or manage state.
 * - Only know how to DISPLAY data and report user interactions.
 *
 * WHY this pattern:
 * 1. REUSABILITY — This stat card can display any statistic. It doesn't
 *    know or care where the data comes from.
 * 2. TESTABILITY — No services to mock. Just pass inputs, check outputs.
 * 3. PREDICTABILITY — Given the same inputs, always renders the same way.
 *
 * Compare with the "Smart" DashboardPage component (its parent) which
 * fetches data from services and passes it down as @Input.
 *
 * CONCEPT: @Input() Decorator
 * Marks a property as an input binding. Parent components pass data
 * to this component via property binding in templates:
 *   <app-stat-card [title]="'Total'" [value]="42" [icon]="'list'">
 */
@Component({
  standalone: false,
  selector: 'app-stat-card',
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.scss']
})
export class StatCard {
  @Input() title = '';
  @Input() value: number | string = 0;
  @Input() icon = 'info';
  @Input() color = '#3f51b5';

  /**
   * PERFORMANCE TIP: This component uses OnPush change detection
   * by default behavior (since it only uses @Input). Angular only
   * re-renders it when an input reference changes.
   * For explicit OnPush, add: changeDetection: ChangeDetectionStrategy.OnPush
   */
}
