/**
 * CONCEPT: Separating Data Models
 * =================================
 * Keep your interfaces in a dedicated `models/` folder so any module
 * can import them without creating circular dependencies.
 */

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

/** Credentials sent to the login endpoint */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Response from the authentication endpoint */
export interface AuthResponse {
  token: string;
  user: User;
}
