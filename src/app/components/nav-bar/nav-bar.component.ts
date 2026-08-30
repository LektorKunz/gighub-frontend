import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

// Simpel navigations-header for hele appen. Ikke en del af "endpoints pr. gang"-tabellen
// direkte, men samler login-status (gang 06) og navigation til de øvrige sider.
@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/events');
  }
}
