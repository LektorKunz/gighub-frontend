import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { GighubEvent } from '../../models/event.model';
import { BookingButtonComponent } from '../booking-button/booking-button.component';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { ReviewListComponent } from '../review-list/review-list.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// Gang 02: første detaljevisning (kun tekstfelter).
// Gang 04: BookingButtonComponent tilføjet.
// Gang 07: gennemsnitsrating (StarRatingComponent) + ReviewListComponent tilføjet.
// Gang 08: FavoriteButtonComponent + ImageUploadComponent (kun for eventets arrangør) tilføjet.
@Component({
  selector: 'app-event-detail',
  imports: [
    DatePipe,
    RouterLink,
    BookingButtonComponent,
    FavoriteButtonComponent,
    ImageUploadComponent,
    ReviewListComponent,
    StarRatingComponent,
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent implements OnInit {
  private readonly eventService = inject(EventService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly event = signal<GighubEvent | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly isOwner = computed(() => {
    const current = this.authService.currentUser();
    const event = this.event();
    return !!current && !!event && current.id === event.arrangoerId;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Eventet kunne ikke findes.');
        this.loading.set(false);
      },
    });
  }

  onFavoriteToggled(isFavorite: boolean): void {
    this.event.update((event) => (event ? { ...event, isFavorite } : event));
  }

  onImageUploaded(imageUrl: string): void {
    this.event.update((event) => (event ? { ...event, imageUrl } : event));
  }

  deleteEvent(): void {
    const event = this.event();
    if (!event) {
      return;
    }
    if (!confirm(`Slet "${event.title}"? Dette kan ikke fortrydes.`)) {
      return;
    }
    this.eventService.delete(event.id).subscribe({
      next: () => this.router.navigateByUrl('/events'),
      error: () => this.errorMessage.set('Eventet kunne ikke slettes.'),
    });
  }
}
