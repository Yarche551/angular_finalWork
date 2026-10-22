import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => controller.verify());

  it('adds x-auth header when the user is logged in', () => {
    authService.setTokens('access', 'refresh');
    http.get(environment.api + 'users').subscribe();

    const request = controller.expectOne(environment.api + 'users');
    expect(request.request.headers.get('x-auth')).toBe('access');
    request.flush({});
  });

  it('does not add the header for guests', () => {
    http.get(environment.api + 'articles/top').subscribe();

    const request = controller.expectOne(environment.api + 'articles/top');
    expect(request.request.headers.has('x-auth')).toBe(false);
    request.flush([]);
  });

  it('refreshes tokens on 401 and repeats the request', () => {
    authService.setTokens('expired', 'refresh');
    let result: unknown;
    http.get(environment.api + 'users').subscribe((data) => (result = data));

    controller
      .expectOne(environment.api + 'users')
      .flush({ error: true, message: 'jwt expired' }, { status: 401, statusText: 'Unauthorized' });
    controller
      .expectOne(environment.api + 'refresh')
      .flush({ accessToken: 'fresh', refreshToken: 'refresh2', userId: '1' });

    const retry = controller.expectOne(environment.api + 'users');
    expect(retry.request.headers.get('x-auth')).toBe('fresh');
    retry.flush({ id: '1', name: 'Тест', email: 'test@gmail.com' });

    expect(result).toEqual({ id: '1', name: 'Тест', email: 'test@gmail.com' });
  });

  it('logs the user out when refresh fails', () => {
    authService.setTokens('expired', 'bad-refresh');
    http.get(environment.api + 'users').subscribe({ error: () => undefined });

    controller
      .expectOne(environment.api + 'users')
      .flush({}, { status: 401, statusText: 'Unauthorized' });
    controller
      .expectOne(environment.api + 'refresh')
      .flush({ error: true, message: 'Токен не валиден' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.isLogged()).toBe(false);
  });
});
