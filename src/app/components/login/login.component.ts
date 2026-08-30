import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

// Gang 06: login-formular mod POST /api/auth/login. Ved succes gemmes JWT via AuthService,
// og brugeren sendes videre til returnUrl (sat af authGuard) eller forsiden.
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/events';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Forkert email eller adgangskode.');
      },
    });
  }
}
