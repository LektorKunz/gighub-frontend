import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

// Gang 06: registrerings-formular mod POST /api/auth/register. Ligesom login logger
// AuthService brugeren ind med det samme (backend returnerer et token ved succesfuld oprettelse).
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/events');
      },
      error: (err) => {
        this.loading.set(false);
        // Tavs fejl-fælde at undgå: en 409 pga. dubleret email skal vises tydeligt,
        // ikke bare som en generisk fejl.
        if (err.status === 409) {
          this.errorMessage.set('Der findes allerede en bruger med denne email.');
        } else {
          this.errorMessage.set('Oprettelse mislykkedes. Prøv igen.');
        }
      },
    });
  }
}
