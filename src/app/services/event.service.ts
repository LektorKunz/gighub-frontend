import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { EventCreateDto, EventQueryParams, EventUpdateDto, GighubEvent, PagedResult } from '../models/event.model';

// Gang 02: første service i appen (kun getEvents/getEvent mod hardcodet liste-endpoint).
// Gang 05: filtrering/søgning/pagination-query-params tilføjet.
// Gang 08: billedupload + favoritter tilføjet.
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/events`;

  // Signals holder den seneste hentede liste, så EventListComponent kan reagere uden
  // selv at holde styr på abonnementer i skabelonen.
  readonly events = signal<GighubEvent[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // gang 02: simpel liste. gang 05: udvidet med filter/søgning/pagination via query-params.
  loadEvents(params: EventQueryParams = {}): void {
    this.loading.set(true);
    this.error.set(null);

    this.getEvents(params).subscribe({
      next: (result) => {
        this.events.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Kunne ikke hente events. Prøv igen senere.');
        this.loading.set(false);
      },
    });
  }

  getEvents(params: EventQueryParams = {}): Observable<PagedResult<GighubEvent>> {
    let httpParams = new HttpParams();
    if (params.genre) {
      httpParams = httpParams.set('genre', params.genre);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.page) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize);
    }

    return this.http.get<PagedResult<GighubEvent>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<GighubEvent> {
    return this.http.get<GighubEvent>(`${this.apiUrl}/${id}`);
  }

  create(dto: EventCreateDto): Observable<GighubEvent> {
    return this.http.post<GighubEvent>(this.apiUrl, dto);
  }

  update(id: number, dto: EventUpdateDto): Observable<GighubEvent> {
    return this.http.put<GighubEvent>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Gang 08: billedupload via multipart/form-data. HttpClient sætter selv den korrekte
  // Content-Type (inkl. boundary) når man sender et FormData-objekt som body — sæt den ALDRIG
  // manuelt på en interceptor, ellers mangler boundary-parameteren og backend kan ikke parse den.
  uploadImage(id: number, file: File): Observable<GighubEvent> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<GighubEvent>(`${this.apiUrl}/${id}/image`, formData);
  }

  // Gang 08: favorit-toggle. Opdaterer det lokale events-signal optimistisk, så hjertet
  // reagerer med det samme uden at skulle genhente hele listen.
  addFavorite(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/favorites`, {}).pipe(
      tap(() => this.patchFavoriteLocally(id, true)),
    );
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/favorites`).pipe(
      tap(() => this.patchFavoriteLocally(id, false)),
    );
  }

  private patchFavoriteLocally(id: number, isFavorite: boolean): void {
    this.events.update((list) =>
      list.map((event) => (event.id === id ? { ...event, isFavorite } : event)),
    );
  }
}
