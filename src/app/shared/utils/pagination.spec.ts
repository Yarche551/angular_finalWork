import { buildPages } from './pagination';

describe('buildPages', () => {
  it('returns nothing when there are no pages', () => {
    expect(buildPages(1, 0)).toEqual([]);
  });

  it('shows every page when there are few of them', () => {
    expect(buildPages(1, 2)).toEqual([1, 2]);
    expect(buildPages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('hides the middle pages around the current one', () => {
    expect(buildPages(5, 20)).toEqual([1, 'gap', 4, 5, 6, 'gap', 20]);
  });

  it('keeps the first pages visible near the start', () => {
    expect(buildPages(2, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
  });

  it('keeps the last pages visible near the end', () => {
    expect(buildPages(19, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
  });
});
