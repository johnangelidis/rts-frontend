import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { FinnhubQuote } from "../models/api.models";

@Injectable({ providedIn: "root" })
export class MarketService {
  constructor(private readonly http: HttpClient) {}
  getQuote(symbol: string) {
    const params = new HttpParams().set("symbol", symbol.trim().toUpperCase());
    return this.http.get<FinnhubQuote>(`${environment.apiBaseUrl}/market/quote`, { params });
  }
}
