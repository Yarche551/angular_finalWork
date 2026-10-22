import { Routes } from '@angular/router';
import { authForwardGuard } from './core/auth/auth-forward.guard';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        title: 'АйтиШторм — веб-студия',
        loadComponent: () => import('./views/main/main').then((m) => m.Main),
      },
      {
        path: 'login',
        title: 'Вход — АйтиШторм',
        canActivate: [authForwardGuard],
        loadComponent: () => import('./views/user/login/login').then((m) => m.Login),
      },
      {
        path: 'signup',
        title: 'Регистрация — АйтиШторм',
        canActivate: [authForwardGuard],
        loadComponent: () => import('./views/user/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'blog',
        title: 'Блог — АйтиШторм',
        loadComponent: () => import('./views/blog/blog/blog').then((m) => m.Blog),
      },
      {
        path: 'blog/:url',
        loadComponent: () => import('./views/blog/article/article').then((m) => m.Article),
      },
      {
        path: 'policy',
        title: 'Политика конфиденциальности — АйтиШторм',
        loadComponent: () => import('./views/policy/policy').then((m) => m.Policy),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
