import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Favorite } from "../models/api.models";

@Injectable({ providedIn: "root" })
export class FavoritesService {
  private readonly url = `${environment.apiBaseUrl}/favorites`;
  constructor(private readonly http: HttpClient) {}
  listForUser(userId: number) {
    return this.http.get<Favorite[]>(`${this.url}/user/${userId}`);
  }
  save(userId: number, ticker: string, openingPrice: number) {
    return this.http.post<Favorite>(this.url, { userId, ticker, openingPrice });
  }
  remove(favoriteId: number) {
    return this.http.delete<void>(`${this.url}/${favoriteId}`);
  }
}
