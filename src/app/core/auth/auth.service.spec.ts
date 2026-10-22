import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('stores tokens and switches to logged in state', () => {
    expect(service.isLogged()).toBe(false);
    service.setTokens('access', 'refresh');
    expect(service.isLogged()).toBe(true);
    expect(service.getTokens()).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
  });

  it('clears tokens and user on logout', () => {
    service.setTokens('access', 'refresh');
    service.userId = '42';
    service.userInfo.set({ id: '42', name: 'Тест', email: 'test@gmail.com' });

    service.removeTokens();

    expect(service.isLogged()).toBe(false);
    expect(service.userId).toBeNull();
    expect(service.userName()).toBe('');
  });

  it('sends a single refresh request for parallel calls', () => {
    service.setTokens('old-access', 'old-refresh');

    service.refresh().subscribe();
    service.refresh().subscribe();

    const request = http.expectOne(environment.api + 'refresh');
    expect(request.request.body).toEqual({ refreshToken: 'old-refresh' });
    request.flush({ accessToken: 'new-access', refreshToken: 'new-refresh', userId: '1' });

    expect(service.getTokens().accessToken).toBe('new-access');
  });
});
