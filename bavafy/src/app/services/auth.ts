import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id:         number;
  name:       string;
  email:      string;
  role:       'superadmin' | 'user';
  avatar_url: string | null;
}

export interface AuthResponse {
  token: string;
  user:  User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  // Signal reactivo — cualquier componente puede leer el usuario actual
  currentUser = signal<User | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  // ── Register ────────────────────────────────────────────────
  register(name: string, email: string, password: string) {
    return this.http.post<{ message: string; user: User }>(
      `${this.api}/register`,
      { name, email, password }
    );
  }

  // ── Login ───────────────────────────────────────────────────
  login(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `${this.api}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user',  JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  // ── Logout ──────────────────────────────────────────────────
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // ── Helpers ─────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isSuperAdmin(): boolean {
    return this.currentUser()?.role === 'superadmin';
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  }
}