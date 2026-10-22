import { Component, computed, input, output } from '@angular/core';
import { buildPages } from '../../utils/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => buildPages(this.current(), this.total()));

  go(page: number): void {
    if (page >= 1 && page <= this.total() && page !== this.current()) {
      this.pageChange.emit(page);
    }
  }
}
