import { Component, inject, input, output } from '@angular/core';

import { EventService } from '../../services/event.service';

// Gang 08: hjerte-toggle-knap til favoritter. Bruges i både EventListComponent (på hvert kort)
// og EventDetailComponent. Kalder EventService, som selv opdaterer sit interne events-signal
// optimistisk, så visningen ikke kræver et ekstra genhent.
@Component({
  selector: 'app-favorite-button',
  imports: [],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
})
export class FavoriteButtonComponent {
  private readonly eventService = inject(EventService);

  readonly eventId = input.required<number>();
  readonly isFavorite = input<boolean>(false);

  readonly toggled = output<boolean>();

  pending = false;

  toggle(): void {
    if (this.pending) {
      return;
    }
    this.pending = true;

    const request$ = this.isFavorite()
      ? this.eventService.removeFavorite(this.eventId())
      : this.eventService.addFavorite(this.eventId());

    request$.subscribe({
      next: () => {
        this.pending = false;
        this.toggled.emit(!this.isFavorite());
      },
      error: () => {
        this.pending = false;
      },
    });
  }
}
