import { HttpClient } from "@angular/common/http";
import { computed, Injectable, signal } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthUser, Credentials } from "../models/api.models";

const USER_STORAGE_KEY = "rts.auth.user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly currentUser = signal<AuthUser | null>(this.readStoredUser());
  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  constructor(private readonly http: HttpClient) { }
  signUp(credentials: Credentials) {
    return this.http
      .post<AuthUser>(`${environment.apiBaseUrl}/auth/signup`, credentials)
      .pipe(tap((user) => this.setUser(user)));
  }
  login(credentials: Credentials) {
    return this.http
      .post<AuthUser>(`${environment.apiBaseUrl}/auth/login`, credentials)
      .pipe(tap((user) => this.setUser(user)));
  }
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
  private setUser(user: AuthUser): void {
    this.currentUser.set(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
  private readStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  }
}
