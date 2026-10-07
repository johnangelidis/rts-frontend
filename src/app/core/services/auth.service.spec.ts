import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('logs in and stores the authenticated user', () => {
    const user = { id: 4, username: 'alice', creationDate: '2026-01-01' };

    service.login({ username: 'alice', password: 'secret' }).subscribe();

    const request = http.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'alice', password: 'secret' });
    request.flush(user);

    expect(service.user()).toEqual(user);
    expect(service.isAuthenticated()).toBeTrue();
    expect(JSON.parse(localStorage.getItem('rts.auth.user')!)).toEqual(user);
  });

  it('clears the authenticated user on logout', () => {
    service.logout();

    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('rts.auth.user')).toBeNull();
  });
});
