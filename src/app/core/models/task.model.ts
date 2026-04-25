/**
 * CONCEPT: TypeScript Interfaces for Type Safety
 * ================================================
 * Angular leverages TypeScript's type system to catch errors at compile time.
 * Interfaces define the "shape" of data — they don't generate JavaScript code,
 * but they help the compiler (and your IDE) enforce correct data usage.
 *
 * WHY: Without interfaces, you'd pass `any` objects around and only discover
 * typos or missing fields at runtime. With interfaces, your editor catches
 * mistakes instantly.
 */

/**
 * Represents a single task in our task manager.
 * This interface is used throughout the app to ensure consistent data shapes.
 */
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';   // Union type — restricts to these exact strings
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;                         // ISO date string from the API
  createdAt: string;
  assignee?: string;                       // Optional field (the ? makes it optional)
}

/**
 * Used when creating a new task — we omit `id` and `createdAt`
 * because the server generates those.
 *
 * WHY use Omit<>: Instead of duplicating the Task interface without `id`,
 * we derive a new type. If Task changes, CreateTaskPayload stays in sync.
 */
export type CreateTaskPayload = Omit<Task, 'id' | 'createdAt'>;

/**
 * Used when updating an existing task — all fields are optional
 * because you might only update the status or title.
 *
 * Partial<T> makes every property of T optional.
 */
export type UpdateTaskPayload = Partial<Task>;
