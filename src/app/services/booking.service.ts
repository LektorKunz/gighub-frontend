import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Booking } from '../models/booking.model';

// Gang 04: POST /api/events/{id}/bookings med fake-bruger (UserId i body).
// Gang 06: UserId fjernes fra requesten — backend læser brugeren fra JWT-token'et
// (sat af authInterceptor), så create()-signaturen bliver simplere efter refactoren.
@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  create(eventId: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/events/${eventId}/bookings`, {});
  }

  // Bruges bl.a. af ReviewListComponent til at afgøre, om den indloggede bruger må anmelde
  // eventet (kun hvis de har en "Booket"-booking på det, jf. forretningsreglen fra gang 07).
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/me`);
  }
}
