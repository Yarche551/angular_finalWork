import { convertToParamMap } from '@angular/router';
import { parseActiveParams, toQueryParams } from './active-params';

describe('active params', () => {
  it('reads page and categories from the URL', () => {
    const params = parseActiveParams(
      convertToParamMap({ page: '2', categories: ['smm', 'dizain'] }),
    );
    expect(params).toEqual({ page: 2, categories: ['smm', 'dizain'] });
  });

  it('falls back to the first page for broken values', () => {
    expect(parseActiveParams(convertToParamMap({ page: 'abc' })).page).toBe(1);
    expect(parseActiveParams(convertToParamMap({ page: '-3' })).page).toBe(1);
    expect(parseActiveParams(convertToParamMap({})).categories).toEqual([]);
  });

  it('drops default values from the query string', () => {
    expect(toQueryParams({ page: 1, categories: [] })).toEqual({ page: null, categories: null });
    expect(toQueryParams({ page: 3, categories: ['smm'] })).toEqual({
      page: 3,
      categories: ['smm'],
    });
  });
});
