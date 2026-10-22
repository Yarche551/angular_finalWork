import { ActivatedRoute } from '@angular/router';

// Куда вернуть пользователя после входа: только внутренние адреса сайта
export function getReturnUrl(route: ActivatedRoute): string {
  const url = route.snapshot.queryParamMap.get('returnUrl');
  return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
}
