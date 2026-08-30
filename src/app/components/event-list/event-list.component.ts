import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { Genre } from '../../models/event.model';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { PaginationComponent } from '../pagination/pagination.component';

const DEFAULT_PAGE_SIZE = 9;

// Gang 02: første version — henter og viser bare alle events med @for.
// Gang 05: filter/søgefelt bundet til query-params (så listen kan deep-linkes/genindlæses
// med samme filter) + pagination-komponent.
// Gang 08: favorit-hjerte på hvert event-kort.
@Component({
  selector: 'app-event-list',
  imports: [ReactiveFormsModule, RouterLink, PaginationComponent, FavoriteButtonComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit {
  protected readonly eventService = inject(EventService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly genres: Genre[] = ['Koncert', 'Fest', 'Standup', 'Foredrag', 'Andet'];
  readonly pageSize = DEFAULT_PAGE_SIZE;

  readonly filterForm = this.formBuilder.nonNullable.group({
    search: [''],
    genre: [''],
  });

  currentPage = 1;

  ngOnInit(): void {
    // Query-params er kilden til sandhed for filter/side, så et genindlæst/delt link
    // reproducerer samme visning.
    this.route.queryParamMap.subscribe((params) => {
      const search = params.get('search') ?? '';
      const genre = (params.get('genre') ?? '') as Genre | '';
      const page = Number(params.get('page') ?? '1');

      this.filterForm.setValue({ search, genre }, { emitEvent: false });
      this.currentPage = page;

      this.eventService.loadEvents({
        search: search || undefined,
        genre: genre || undefined,
        page,
        pageSize: this.pageSize,
      });
    });
  }

  applyFilter(): void {
    const { search, genre } = this.filterForm.getRawValue();
    this.navigate({ search: search || null, genre: genre || null, page: 1 });
  }

  goToPage(page: number): void {
    this.navigate({ page });
  }

  private navigate(partialParams: Record<string, string | number | null>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: partialParams,
      queryParamsHandling: 'merge',
    });
  }
}
