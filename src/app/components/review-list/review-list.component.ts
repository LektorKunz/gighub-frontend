import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// Gang 07: liste af anmeldelser + formular til at oprette en ny. Formularen vises kun betinget
// (bruger er logget ind OG har en "Booket"-booking på eventet) — selve forretningsreglen
// håndhæves stadig på backend, dette er blot en UX-genvej der undgår en fejlbesked man kunne
// have undgået at vise i første omgang.
@Component({
  selector: 'app-review-list',
  imports: [ReactiveFormsModule, StarRatingComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
})
export class ReviewListComponent implements OnInit {
  private readonly reviewService = inject(ReviewService);
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  readonly eventId = input.required<number>();

  readonly reviews = signal<Review[]>([]);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly canReview = signal(false);

  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());

  readonly reviewForm = this.formBuilder.nonNullable.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    this.loadReviews();
    if (this.isLoggedIn()) {
      this.checkCanReview();
    }
  }

  private loadReviews(): void {
    this.loading.set(true);
    this.reviewService.getForEvent(this.eventId()).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Kunne ikke hente anmeldelser.');
        this.loading.set(false);
      },
    });
  }

  // Simpel klient-side gæt på om formularen bør vises: har brugeren en "Booket"-booking
  // på netop dette event? Backend er stadig autoritativ ved selve POST'et.
  private checkCanReview(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        const hasBooked = bookings.some(
          (b) => b.eventId === this.eventId() && b.status === 'Booket',
        );
        this.canReview.set(hasBooked);
      },
      error: () => this.canReview.set(false),
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const dto = this.reviewForm.getRawValue();

    this.reviewService.create(this.eventId(), dto).subscribe({
      next: (review) => {
        this.submitting.set(false);
        this.reviews.update((list) => [review, ...list]);
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.canReview.set(false); // man kan kun anmelde ét event én gang
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set(
          'Anmeldelsen kunne ikke oprettes. Har du deltaget i eventet, og er det overstået?',
        );
      },
    });
  }
}
