import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

// gang 02: kun /events og /events/:id.
// gang 04: /events/new, /events/:id/edit (beskyttet af authGuard fra gang 06).
// gang 06: /login, /register.
export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  {
    path: 'events',
    loadComponent: () =>
      import('./components/event-list/event-list.component').then((m) => m.EventListComponent),
  },
  {
    path: 'events/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/event-form/event-form.component').then((m) => m.EventFormComponent),
  },
  {
    path: 'events/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/event-form/event-form.component').then((m) => m.EventFormComponent),
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./components/event-detail/event-detail.component').then(
        (m) => m.EventDetailComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: 'events' },
];
