import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

import { AuthResponse, LoginRequest, RegisterRequest } from './auth.model';

/**
 * Service responsable de l'authentification.
 *
 * Backend (Jakarta EE) :
 * - Auth = session HTTP (cookie JSESSIONID)
 * - Après login, les endpoints /api/* protégés répondent 200
 *   tant que la session est valide.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = '/api/auth';

  /**
   * Endpoint protégé utilisé pour "sonder" la session côté backend.
   * Si 200 => session OK, si 401 => pas connecté.
   */
  private readonly sessionProbeUrl = '/api/trainers';

  /**
   * Petit persistant local (dev) pour éviter un "logout visuel" au refresh.
   * (Le vrai contrat d'auth reste le cookie session.)
   */
  private readonly storageKey = 'mypokedex.auth';

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private readonly currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.restoreFromStorage();
  }

  /**
   * Envoie les identifiants au backend.
   * Le backend crée une session HTTP et renvoie un cookie JSESSIONID.
   */
  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/login`, payload).pipe(
      tap((response) => {
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(response);
        this.persistToStorage({ isLoggedIn: true, currentUser: response });
      })
    );
  }

  /**
   * Crée un nouvel utilisateur.
   */
  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/register`, payload);
  }

  /**
   * Détruit la session côté backend.
   */
  logout(): Observable<string> {
    return this.http
      .post<string>(`${this.apiBaseUrl}/logout`, {}, { responseType: 'text' as 'json' })
      .pipe(
        tap(() => this.clearLocalAuthState()),
        catchError(() => {
          this.clearLocalAuthState();
          return of('logout');
        })
      );
  }

  /**
   * Vérifie côté backend si la session cookie est toujours valide.
   * Utile au refresh ou si l'utilisateur ouvre un nouvel onglet.
   */
  checkSession(): Observable<boolean> {
    return this.http.get<unknown>(this.sessionProbeUrl, { observe: 'response' }).pipe(
      map((res: HttpResponse<unknown>) => {
        const ok = res.status >= 200 && res.status < 300;
        if (ok) {
          this.isLoggedInSubject.next(true);
          this.persistToStorage({ isLoggedIn: true, currentUser: this.currentUserSubject.value });
          return true;
        }
        this.clearLocalAuthState();
        return false;
      }),
      catchError(() => {
        this.clearLocalAuthState();
        return of(false);
      })
    );
  }

  /**
   * Méthode synchrone pratique pour les guards.
   */
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  private restoreFromStorage(): void {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as { isLoggedIn?: boolean; currentUser?: AuthResponse | null };
      if (parsed?.isLoggedIn) {
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(parsed.currentUser ?? null);
      }
    } catch {
      // ignore
    }
  }

  private persistToStorage(payload: { isLoggedIn: boolean; currentUser: AuthResponse | null }): void {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  private clearLocalAuthState(): void {
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    try {
      sessionStorage.removeItem(this.storageKey);
    } catch {
      // ignore
    }
  }
}
