import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Review, ReviewCreateDto } from '../models/review.model';

// Gang 07: anmeldelser. Backend håndhæver forretningsreglen (kun anmeld events man har
// deltaget i, efter de er overstået) — frontend viser blot formularen betinget og lader
// et evt. 403/400-svar fra backend blive vist som en fejlbesked.
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getForEvent(eventId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/events/${eventId}/reviews`);
  }

  create(eventId: number, dto: ReviewCreateDto): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/events/${eventId}/reviews`, dto);
  }
}
