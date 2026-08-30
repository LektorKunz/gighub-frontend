import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

const TOKEN_KEY = 'gighub_token';
const USER_KEY = 'gighub_user';

// Gang 06: erstatter fake-bruger-tilgangen fra gang 04. Login/registrering giver et JWT,
// som gemmes i localStorage og lægges på Authorization-headeren af authInterceptor.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Signal er kilden til sandhed for "hvem er logget ind" i hele appen.
  private readonly currentUserSignal = signal<User | null>(this.readStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isArrangoer = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 'Arrangoer' || role === 'Admin';
  });

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
