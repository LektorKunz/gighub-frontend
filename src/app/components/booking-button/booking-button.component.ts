import { Component, computed, inject, input, output, signal } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

// Gang 04: knap der kalder POST /api/events/{id}/bookings med fake-bruger.
// Gang 06: BookingService.create() kræver ikke længere et userId-argument — backend læser
// brugeren fra JWT'et. Komponenten kræver nu at man er logget ind for at booke.
@Component({
  selector: 'app-booking-button',
  imports: [],
  templateUrl: './booking-button.component.html',
  styleUrl: './booking-button.component.scss',
})
export class BookingButtonComponent {
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);

  readonly eventId = input.required<number>();

  readonly booked = output<Booking>();

  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  readonly loading = signal(false);
  readonly result = signal<Booking | null>(null);
  readonly errorMessage = signal<string | null>(null);

  book(): void {
    if (!this.isLoggedIn()) {
      this.errorMessage.set('Du skal være logget ind for at booke.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.bookingService.create(this.eventId()).subscribe({
      next: (booking) => {
        this.loading.set(false);
        this.result.set(booking);
        this.booked.emit(booking);
      },
      error: (err) => {
        this.loading.set(false);
        // Dobbelt-booking (409) håndteres pænt med en brugervenlig besked (gang 05/06),
        // frem for at lade constraint violation-fejlen fra backend boble op rå.
        if (err.status === 409) {
          this.errorMessage.set('Du er allerede booket til dette event.');
        } else {
          this.errorMessage.set('Booking mislykkedes. Prøv igen.');
        }
      },
    });
  }
}
