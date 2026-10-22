import { ParamMap } from '@angular/router';
import { ActiveParamsType } from '../../types/active-params.type';

// Фильтр и пагинация блога хранятся в URL: /blog?page=2&categories=smm&categories=dizain
export function parseActiveParams(params: ParamMap): ActiveParamsType {
  const page = Number(params.get('page'));
  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    categories: params.getAll('categories'),
  };
}

export function toQueryParams(params: ActiveParamsType): Record<string, string | number | string[] | null> {
  return {
    page: params.page > 1 ? params.page : null,
    categories: params.categories.length ? params.categories : null,
  };
}
