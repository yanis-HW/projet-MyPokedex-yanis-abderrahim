import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

import { AuthService } from './auth.service';

/**
 * Guard de protection des routes nécessitant une authentification.
 *
 * Points importants :
 * - L'état en mémoire saute au refresh.
 * - Le backend utilise une session cookie (JSESSIONID).
 * => Si on n'est pas "auth" en mémoire, on sonde le backend.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardClass {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Au refresh (ou nouvel onglet), on vérifie si la session cookie est encore valide.
    return this.authService.checkSession().pipe(
      map((ok) => (ok ? true : this.router.parseUrl('/login')))
    );
  }
}

/**
 * Version fonctionnelle du guard, à utiliser dans la config de routing.
 */
export const AuthGuard: CanActivateFn = () => {
  const guard = inject(AuthGuardClass);
  return guard.canActivate();
};
