import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EventService } from '../../services/event.service';
import { Genre } from '../../models/event.model';

// Gang 04: reactive form til at oprette/redigere events (POST/PUT /api/events).
// Beskyttet af authGuard fra gang 06 via ruten i app.routes.ts.
@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  readonly genres: Genre[] = ['Koncert', 'Fest', 'Standup', 'Foredrag', 'Andet'];

  readonly eventId = signal<number | null>(null);
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly eventForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    genre: ['Koncert' as Genre, [Validators.required]],
    venueName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    dateTimeUtc: ['', [Validators.required]],
    capacity: [50, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.eventId.set(id);
      this.isEditMode.set(true);
      this.loadEvent(id);
    }
  }

  private loadEvent(id: number): void {
    this.loading.set(true);
    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          genre: event.genre,
          venueName: event.venueName,
          address: event.address,
          dateTimeUtc: event.dateTimeUtc.substring(0, 16), // til <input type="datetime-local">
          capacity: event.capacity,
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Kunne ikke hente eventet.');
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    const dto = this.eventForm.getRawValue();

    const id = this.eventId();
    const request$ = this.isEditMode() && id !== null
      ? this.eventService.update(id, dto)
      : this.eventService.create(dto);

    request$.subscribe({
      next: (event) => {
        this.loading.set(false);
        this.router.navigate(['/events', event.id]);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Eventet kunne ikke gemmes. Tjek felterne og prøv igen.');
      },
    });
  }
}
