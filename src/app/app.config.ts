import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // gang 02: HttpClient med fetch-baseret backend (withFetch) i stedet for XHR.
    // gang 06: authInterceptor tilføjet, så JWT automatisk følger med på alle requests.
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
