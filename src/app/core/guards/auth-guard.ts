import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

// Gang 06: funktionsbaseret guard (CanActivateFn) — beskytter ruter, der kræver login
// (fx event-form til oprettelse/redigering). Sendes til login-siden hvis ikke logget ind.
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
