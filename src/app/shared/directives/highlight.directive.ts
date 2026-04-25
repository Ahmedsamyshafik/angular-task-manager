import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

/**
 * CONCEPT: Custom Directives
 * ============================
 * Directives are classes that add behavior to elements in the DOM.
 * There are three types:
 * 1. Component directives — components are actually directives with templates.
 * 2. Structural directives — change DOM layout (*ngIf, *ngFor, etc.).
 * 3. Attribute directives — change the appearance or behavior of an element.
 *
 * This is an ATTRIBUTE directive — it changes the element's background
 * color on hover, similar to CSS :hover but with dynamic, configurable colors.
 *
 * WHY create custom directives:
 * - Reuse DOM manipulation logic across many elements/components.
 * - Keep components focused on business logic, not DOM manipulation.
 * - Encapsulate complex DOM behavior in a testable, reusable unit.
 *
 * USAGE in templates:
 *   <div appHighlight>Default yellow highlight</div>
 *   <div appHighlight="#e3f2fd">Custom blue highlight</div>
 */
@Directive({
  standalone: false,
  selector: '[appHighlight]'  // Attribute selector — used as an HTML attribute
})
export class HighlightDirective implements OnInit {
  /**
   * CONCEPT: @Input on Directives
   * The directive's selector name can double as an @Input binding.
   * This lets users pass a value directly:  <div appHighlight="#ff0">
   * instead of needing a separate attribute: <div appHighlight [color]="#ff0">
   */
  @Input() appHighlight = '';

  /** Fallback color if none is provided */
  private defaultColor = '#fff9c4';

  /**
   * CONCEPT: ElementRef — Direct DOM Access
   * ElementRef gives you a reference to the host DOM element.
   * Use it sparingly — direct DOM manipulation bypasses Angular's
   * change detection and can break server-side rendering (SSR).
   * For simple styling, Renderer2 is the safer alternative.
   */
  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Set a smooth transition for the background color change
    this.el.nativeElement.style.transition = 'background-color 0.3s ease';
  }

  /**
   * CONCEPT: @HostListener — Listening to Host Element Events
   * @HostListener binds a method to a DOM event on the HOST element
   * (the element this directive is attached to).
   *
   * WHY @HostListener over addEventListener:
   * - Angular automatically cleans up the listener when the directive is destroyed.
   * - It's declarative and easy to read.
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.setBackgroundColor(this.appHighlight || this.defaultColor);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setBackgroundColor('');
  }

  private setBackgroundColor(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
