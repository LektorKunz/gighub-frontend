import { Component, computed, input, output } from '@angular/core';

// Gang 05: bindes til query-params (page/pageSize) i EventListComponent.
@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalCount = input.required<number>();

  readonly pageChange = output<number>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));
  readonly hasPrevious = computed(() => this.page() > 1);
  readonly hasNext = computed(() => this.page() < this.totalPages());

  goToPrevious(): void {
    if (this.hasPrevious()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  goToNext(): void {
    if (this.hasNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
