import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MarketService } from './market.service';
import { environment } from '../../../environments/environment';

describe('MarketService', () => {
  let service: MarketService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MarketService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests a normalized symbol through the backend quote endpoint', () => {
    service.getQuote('  aapl ').subscribe();

    const request = http.expectOne(`${environment.apiBaseUrl}/market/quote?symbol=AAPL`);

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('symbol')).toBe('AAPL');
    request.flush({ c: 190, h: 192, l: 188, o: 189, pc: 187, t: 1700000000 });
  });
});
