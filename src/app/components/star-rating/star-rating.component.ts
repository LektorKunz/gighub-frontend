import { Component, computed, input } from '@angular/core';

// Gang 07: simpel stjerne-visning til gennemsnitsrating på event-detaljer og til den enkelte
// anmeldelses rating i ReviewListComponent. Ren visnings-komponent (readonly) — ingen input-form
// her, det ligger i ReviewListComponent's reactive form.
@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  // Rating fra 0-5 (kan være decimaltal, fx et gennemsnit på 3.7).
  readonly rating = input<number>(0);
  readonly maxStars = input<number>(5);

  // Afrundes til nærmeste hele stjerne for den simple visning.
  readonly stars = computed(() => {
    const max = this.maxStars();
    const filled = Math.round(this.rating());
    return Array.from({ length: max }, (_, i) => i < filled);
  });
}
