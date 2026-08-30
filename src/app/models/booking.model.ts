// Matcher backendens Booking-entitet/DTO'er.

export type BookingStatus = 'Booket' | 'Venteliste' | 'Aflyst';

export interface Booking {
  id: number;
  eventId: number;
  userId: number;
  status: BookingStatus;
  createdAt: string;
}

// Gang 04: fake-bruger, userId sendes direkte i body.
// Gang 06: userId fjernes, hentes i stedet fra JWT-claims på backend — se BookingService.
export interface BookingCreateDtoLegacy {
  userId: number;
}
