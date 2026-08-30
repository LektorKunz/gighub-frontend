// Matcher backendens Review-entitet/DTO'er (gang 07).

export interface Review {
  id: number;
  eventId: number;
  userId: number;
  userName: string; // backend joiner brugernavnet med, så frontend ikke skal slå det op selv
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface ReviewCreateDto {
  rating: number;
  comment: string;
}
