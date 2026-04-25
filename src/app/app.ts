import { Component } from '@angular/core';

/**
 * CONCEPT: Root Component
 * ========================
 * App (AppComponent) is the root of the component tree. Every other
 * component in the application is a child (direct or nested) of this one.
 *
 * The root component is deliberately minimal — it just provides the
 * app shell (header + router outlet) and lets feature modules handle
 * the actual content.
 *
 * CONCEPT: <router-outlet>
 * This is a placeholder directive that Angular replaces with the
 * component matching the current route. When the URL changes,
 * Angular destroys the old component and creates the new one
 * inside the <router-outlet>.
 *
 * Example: URL /dashboard → Angular renders DashboardPage inside
 * the <router-outlet>, replacing whatever was there before.
 */
@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'Angular Task Manager';
}
