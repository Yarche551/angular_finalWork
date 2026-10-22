export type PageItem = number | 'gap';

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

// «Умная» пагинация: если страниц много, показываем первую, последнюю,
// соседей текущей страницы и многоточия между ними: 1 … 4 5 6 … 20
export function buildPages(current: number, total: number): PageItem[] {
  if (total <= 0) {
    return [];
  }
  if (total <= 7) {
    return range(1, total);
  }
  if (current <= 4) {
    return [...range(1, 5), 'gap', total];
  }
  if (current >= total - 3) {
    return [1, 'gap', ...range(total - 4, total)];
  }
  return [1, 'gap', current - 1, current, current + 1, 'gap', total];
}
