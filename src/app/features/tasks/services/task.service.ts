import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../../../core/models/task.model';

/**
 * CONCEPT: HTTP Client Service
 * ==============================
 * This service handles all HTTP communication with the backend API.
 * It uses Angular's HttpClient, which returns Observables for every
 * HTTP method.
 *
 * WHY return Observables (not Promises):
 * 1. Cancellable — unsubscribing cancels the HTTP request.
 * 2. Composable — chain operators like map, retry, catchError.
 * 3. Lazy — the request only fires when someone subscribes.
 *
 * CONCEPT: CRUD Operations
 * CRUD = Create, Read, Update, Delete — the four basic data operations.
 * These map directly to HTTP methods:
 *   Create → POST
 *   Read   → GET
 *   Update → PUT (full replace) or PATCH (partial update)
 *   Delete → DELETE
 *
 * API URL: We use JSON Server (localhost:3000) as a mock REST API.
 * JSON Server auto-generates RESTful endpoints from a db.json file.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * Base URL for the tasks API.
   * In a real app, this would come from environment.ts:
   *   private apiUrl = environment.apiUrl + '/tasks';
   */
  private apiUrl = 'http://localhost:3000/tasks';

  /**
   * CONCEPT: Dependency Injection in Action
   * HttpClient is injected via the constructor. Angular's DI system
   * automatically provides the HttpClient instance (registered in
   * CoreModule via provideHttpClient()).
   */
  constructor(private http: HttpClient) {}

  /**
   * READ — Get all tasks.
   * GET /tasks
   *
   * HttpClient.get<Task[]>() — the generic <Task[]> tells TypeScript
   * what type the response body will be. This gives you type safety
   * and autocomplete on the response data.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * READ — Get a single task by ID.
   * GET /tasks/:id
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * CREATE — Add a new task.
   * POST /tasks
   *
   * The second argument to .post() is the request body.
   * JSON Server will auto-assign an `id` to the new resource.
   */
  createTask(task: CreateTaskPayload): Observable<Task> {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString().split('T')[0]
    };
    return this.http.post<Task>(this.apiUrl, newTask);
  }

  /**
   * UPDATE — Modify an existing task.
   * PUT /tasks/:id
   *
   * PUT replaces the entire resource. Use PATCH for partial updates.
   * JSON Server supports both PUT and PATCH.
   */
  updateTask(id: number, changes: UpdateTaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, changes);
  }

  /**
   * DELETE — Remove a task.
   * DELETE /tasks/:id
   *
   * Returns an Observable<void> — the response body is empty on success.
   * JSON Server returns the deleted resource, but we type it as Task
   * since that's what comes back.
   */
  deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${id}`);
  }
}
