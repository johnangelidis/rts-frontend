import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FavoritesService } from './favorites.service';
import { environment } from '../../../environments/environment';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let http: HttpTestingController;
  const url = `${environment.apiBaseUrl}/favorites`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavoritesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FavoritesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists favorites for a user', () => {
    service.listForUser(7).subscribe();

    const request = http.expectOne(`${url}/user/7`);

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('saves a favorite with its opening price', () => {
    service.save(7, 'AAPL', 189.75).subscribe();

    const request = http.expectOne(url);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ userId: 7, ticker: 'AAPL', openingPrice: 189.75 });
    request.flush({ id: 3, userId: 7, ticker: 'AAPL', openingPrice: 189.75 });
  });

  it('deletes a favorite', () => {
    service.remove(3).subscribe();

    const request = http.expectOne(`${url}/3`);

    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
