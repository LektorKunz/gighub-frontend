// Matcher backendens Event-entitet/DTO'er.

import type { BookingStatus } from './booking.model';
import type { Review } from './review.model';

export type Genre = 'Koncert' | 'Fest' | 'Standup' | 'Foredrag' | 'Andet';

export interface GighubEvent {
  id: number;
  title: string;
  description: string;
  genre: Genre;
  venueName: string;
  address: string;
  dateTimeUtc: string; // ISO 8601-dato-streng fra JSON
  capacity: number;
  imageUrl: string | null;
  arrangoerId: number;
  arrangoerName: string;
  createdAt: string;

  // Beregnede/afledte felter, der først kommer med på GET /api/events/{id} (EventDetailDto),
  // ikke på listen (GET /api/events, EventDto) — se facit-backend/GigHub.Api/Dtos/EventDtos.cs.
  bookedCount?: number; // hvor mange der er "Booket" lige nu (bruges til ledig-plads-visning)
  averageRating?: number | null; // gang 07: GET /api/events/{id} inkl. gennemsnitsrating
  reviewCount?: number; // gang 07
  reviews?: Review[]; // gang 07
  myBookingStatus?: BookingStatus | null; // gang 07: styrer om "skriv anmeldelse" kan vises
  isFavorite?: boolean; // gang 08: om den indloggede bruger har eventet som favorit
}

// Bruges af EventFormComponent (POST/PUT) — ingen Id/CreatedAt, da backend sætter dem.
export interface EventCreateDto {
  title: string;
  description: string;
  genre: Genre;
  venueName: string;
  address: string;
  dateTimeUtc: string;
  capacity: number;
  imageUrl?: string | null;
}

export type EventUpdateDto = EventCreateDto;

// Query-params til GET /api/events?genre=&search=&page=&pageSize= (gang 05).
export interface EventQueryParams {
  genre?: Genre | '';
  search?: string;
  page?: number;
  pageSize?: number;
}

// Backend pagineres i en "envelope" med metadata om det samlede resultat.
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
