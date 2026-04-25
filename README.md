# Angular Task Manager — Educational Project

A complete, real-world Angular application built as a **learning resource** for beginner-to-intermediate developers. This project demonstrates all essential Angular concepts through a practical task management system.

## Quick Start

```bash
# Install dependencies
npm install

# Start the mock API server (JSON Server on port 3000)
npm run start:api

# In a separate terminal, start the Angular dev server (port 4200)
npm start

# Or start both together
npm run start:all
```

Navigate to `http://localhost:4200`. Login with:
- **Admin:** `admin` / `admin123`
- **User:** `user` / `user123`

---

## Project Structure

```
src/app/
│
├── core/                        # Singleton services — imported ONCE in AppModule
│   ├── guards/
│   │   └── auth.guard.ts        # Route protection (CanActivate)
│   ├── interceptors/
│   │   └── api.interceptor.ts   # HTTP interceptor (auto-attach tokens, error handling)
│   ├── models/
│   │   ├── task.model.ts        # Task interface, CreateTaskPayload, UpdateTaskPayload
│   │   └── user.model.ts        # User, LoginCredentials, AuthResponse interfaces
│   ├── services/
│   │   ├── auth.service.ts      # Authentication (login/logout, session management)
│   │   └── notification.service.ts  # Snackbar notifications wrapper
│   └── core.module.ts           # CoreModule with import guard
│
├── shared/                      # Reusable items — imported by EVERY feature module
│   ├── components/
│   │   └── confirm-dialog/      # Reusable confirmation dialog
│   ├── directives/
│   │   └── highlight.directive.ts   # Custom attribute directive (hover highlight)
│   ├── pipes/
│   │   └── priority-label.pipe.ts   # Custom pipe (priority → emoji label)
│   └── shared.module.ts         # Re-exports CommonModule, Material, FormsModule
│
├── features/                    # Feature modules — lazy loaded on demand
│   ├── auth/                    # Authentication feature
│   │   ├── pages/login/         # Login page (reactive form)
│   │   ├── auth.module.ts
│   │   └── auth-routing.module.ts
│   │
│   ├── dashboard/               # Dashboard feature
│   │   ├── containers/          # Smart components (fetch data, manage state)
│   │   │   └── dashboard-page/
│   │   ├── components/          # Dumb components (display only)
│   │   │   └── stat-card/
│   │   ├── dashboard.module.ts
│   │   └── dashboard-routing.module.ts
│   │
│   └── tasks/                   # Tasks feature (CRUD operations)
│       ├── services/
│       │   ├── task.service.ts       # HTTP CRUD service
│       │   └── task-state.service.ts # Service-based state management
│       ├── containers/          # Smart components
│       │   ├── task-list/       # Task list with filters
│       │   └── task-detail/     # Single task detail view
│       ├── components/          # Dumb components
│       │   ├── task-card/       # Individual task display
│       │   ├── task-form/       # Reactive form (create/edit)
│       │   └── task-quick-add/  # Template-driven form (quick add)
│       ├── tasks.module.ts
│       └── tasks-routing.module.ts
│
├── layout/                      # App shell components
│   ├── header/                  # Navigation header
│   └── layout.module.ts
│
├── app.ts                       # Root component
├── app.html                     # App shell template (<router-outlet>)
├── app-module.ts                # Root module
└── app-routing-module.ts        # Root routes with lazy loading
```

### Why This Structure?

| Folder | Purpose | Import Rule |
|--------|---------|-------------|
| `core/` | Singleton services, guards, interceptors | Import ONLY in AppModule |
| `shared/` | Reusable components, directives, pipes | Import in any feature module |
| `features/` | Self-contained feature areas | Lazy loaded via routes |
| `layout/` | App shell (header, footer) | Import in AppModule |

---

## Angular Concepts Demonstrated

### 1. Components (Smart vs Dumb)

**Smart (Container) Components** — manage data and state:
- `DashboardPage` — fetches tasks, calculates stats, passes data to children
- `TaskList` — coordinates CRUD operations, manages filters
- `TaskDetail` — loads single task via route params

**Dumb (Presentational) Components** — pure display:
- `StatCard` — receives `@Input()` data, renders a stat card
- `TaskCard` — receives task, emits edit/delete/statusChange events via `@Output()`
- `TaskForm` — receives optional task for edit mode, emits save/cancel

### 2. Data Binding (All Four Types)

| Type | Syntax | Direction | Example File |
|------|--------|-----------|-------------|
| Interpolation | `{{ expression }}` | Component → Template | `header.html` |
| Property Binding | `[property]="value"` | Component → Template | `stat-card.html` |
| Event Binding | `(event)="handler()"` | Template → Component | `task-card.html` |
| Two-Way Binding | `[(ngModel)]="prop"` | Both directions | `task-quick-add.html` |

### 3. Directives

**Built-in Structural Directives:**
- `*ngIf` — conditional rendering (`dashboard-page.html`, `task-list.html`)
- `*ngFor` — list rendering with `trackBy` (`dashboard-page.html`, `task-list.html`)

**Custom Attribute Directive:**
- `HighlightDirective` — hover highlight effect (`shared/directives/highlight.directive.ts`)
- Uses `@HostListener`, `ElementRef`, `@Input()` on the directive selector

### 4. Pipes

**Built-in Pipes:**
- `date` — format dates (`dashboard-page.html`)
- Used throughout templates

**Custom Pipe:**
- `PriorityLabelPipe` — transforms `'high'` → `'🔴 High Priority'` (`shared/pipes/priority-label.pipe.ts`)
- Supports arguments: `{{ priority | priorityLabel:'short' }}`
- Pure by default for performance

### 5. Services & Dependency Injection

- `AuthService` — authentication logic with `providedIn: 'root'` singleton
- `TaskService` — HTTP CRUD operations
- `TaskStateService` — service-based state management with BehaviorSubject
- `NotificationService` — wrapper around MatSnackBar

### 6. Routing

- **Lazy Loading** — feature modules loaded on demand via `loadChildren` (`app-routing-module.ts`)
- **Route Guards** — `AuthGuard` protects dashboard and tasks routes
- **Route Parameters** — `:id` parameter for task detail (`/tasks/5`)
- **Child Routes** — each feature module defines its own routes with `forChild()`
- **routerLink** — declarative navigation in templates
- **routerLinkActive** — CSS class for active navigation links

### 7. Forms

**Reactive Forms (Login, Task Form):**
- `FormBuilder`, `FormGroup`, `FormControl`
- `Validators.required`, `Validators.minLength`, `Validators.maxLength`
- `markAllAsTouched()`, `patchValue()`, `reset()`
- Error messages with `mat-error` and `*ngIf`

**Template-Driven Forms (Task Quick Add):**
- `[(ngModel)]` two-way binding
- `#quickForm="ngForm"` template reference
- `required`, `minlength` directive validators

### 8. HTTP Client

- Full CRUD: `GET`, `POST`, `PUT`, `DELETE` (`task.service.ts`)
- Generic typing: `http.get<Task[]>(url)`
- JSON Server as mock REST API

### 9. RxJS & Observables

| Operator | Used In | Purpose |
|----------|---------|---------|
| `map` | `auth.guard.ts` | Transform auth state to boolean/UrlTree |
| `switchMap` | `task-detail.ts` | Chain route params → task fetch (cancels previous) |
| `catchError` | `api.interceptor.ts`, `task-state.service.ts` | Handle HTTP errors gracefully |
| `tap` | `auth.service.ts`, `task-state.service.ts` | Side effects (update state, show notifications) |
| `takeUntil` | All smart components | Auto-unsubscribe on component destroy |
| `take(1)` | `auth.guard.ts` | Take one value then complete |
| `delay` | `auth.service.ts` | Simulate network latency |
| `BehaviorSubject` | `auth.service.ts`, `task-state.service.ts` | State management with current value |

### 10. State Management

Service-based state using **BehaviorSubject** pattern (`task-state.service.ts`):
```
Component → calls TaskStateService.addTask()
  → TaskStateService calls TaskService.createTask() (HTTP POST)
    → On success, updates BehaviorSubject with new task list
      → All subscribed components receive updated data automatically
```

---

## How Data Flows in the App

```
┌─────────────┐     HTTP      ┌──────────────┐
│  JSON Server │◄────────────►│ TaskService   │  (HTTP CRUD)
│  (db.json)   │              │ (HttpClient)  │
└─────────────┘              └──────┬───────┘
                                    │
                              ┌─────▼────────┐
                              │TaskStateService│  (BehaviorSubject state)
                              │  tasks$       │
                              │  loading$     │
                              └──────┬───────┘
                                    │ subscribe
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼──────┐
              │ TaskList   │  │ Dashboard │  │ TaskDetail │  (Smart)
              │ (container)│  │ (container)│  │ (container) │
              └─────┬─────┘  └─────┬─────┘  └────────────┘
                    │               │
              @Input │         @Input │
              ┌─────▼─────┐  ┌─────▼─────┐
              │ TaskCard   │  │ StatCard   │  (Dumb)
              │ TaskForm   │  └───────────┘
              │ TaskQuickAdd│
              └───────────┘
                    │
              @Output (events: edit, delete, save)
                    │
              ┌─────▼─────┐
              │ TaskList   │  (handles event, calls TaskStateService)
              └───────────┘
```

---

## Common Mistakes Beginners Make

1. **Not unsubscribing from Observables**
   Leads to memory leaks. Use the `takeUntil` + `destroy$` pattern (see `header.ts`), or the `async` pipe in templates.

2. **Importing CoreModule in feature modules**
   Creates duplicate service instances. CoreModule has a guard to prevent this — see `core.module.ts`.

3. **Using `BrowserModule` in feature modules**
   Only import `BrowserModule` in the root `AppModule`. Feature modules should import `CommonModule` (which `SharedModule` re-exports).

4. **Calling methods in templates for data transformation**
   Methods run on EVERY change detection cycle. Use **pipes** instead — they're pure and only recalculate when inputs change.

5. **Forgetting `trackBy` in `*ngFor`**
   Without `trackBy`, Angular destroys and recreates all DOM elements when the array changes. Add `trackBy` for any list that updates frequently.

6. **Subscribing inside a subscribe (nested subscriptions)**
   Use RxJS operators like `switchMap`, `mergeMap`, or `concatMap` to chain Observables instead.

7. **Not using `pathMatch: 'full'` on redirect routes**
   Without it, `''` matches every route prefix, causing unexpected redirects.

8. **Mutating state directly instead of creating new references**
   Angular's change detection (especially OnPush) relies on reference changes. Always spread arrays/objects: `this.tasks = [...this.tasks, newTask]`.

---

## Performance Tips

1. **Use `OnPush` Change Detection** — Components only re-render when `@Input` references change, an event fires, or an Observable emits via `async` pipe. Great for dumb components.

2. **Always use `trackBy` with `*ngFor`** — Prevents unnecessary DOM recreation. See `task-list.html`.

3. **Lazy Load Feature Modules** — Only download code when the user needs it. See `app-routing-module.ts`.

4. **Use Pure Pipes** — They cache results and only recalculate on input changes. See `priority-label.pipe.ts`.

5. **Unsubscribe from Observables** — Prevents memory leaks. Use `takeUntil` pattern or `async` pipe.

6. **Avoid Complex Logic in Templates** — Move calculations to component properties or getters. Use pipes for data transformation.

7. **Use Angular DevTools** — Chrome extension that lets you inspect component trees, profile change detection, and debug performance issues.

---

## Best Practices for Scalable Apps

1. **Feature-based folder structure** — Group by feature, not by type. Each feature is self-contained.
2. **Smart/Dumb component pattern** — Separates data management from presentation.
3. **Single Responsibility** — Each service handles one concern (auth, tasks, notifications).
4. **Interfaces for everything** — TypeScript interfaces catch bugs before runtime.
5. **Barrel exports** — Use `index.ts` files to simplify imports in large projects.
6. **Environment files** — Use `environment.ts` / `environment.prod.ts` for API URLs.
7. **Consistent naming** — Follow Angular style guide conventions.
8. **Wrap third-party libraries** — See `NotificationService` wrapping `MatSnackBar`.

---

## Technologies Used

- **Angular 21** — Frontend framework
- **Angular Material** — UI component library (Material Design)
- **RxJS** — Reactive programming with Observables
- **TypeScript** — Type-safe JavaScript
- **JSON Server** — Mock REST API from a JSON file
- **SCSS** — CSS preprocessor for cleaner styles

---

## Further Reading

- [Angular Official Docs](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Material](https://material.angular.dev)
- [Angular Style Guide](https://angular.dev/style-guide)
