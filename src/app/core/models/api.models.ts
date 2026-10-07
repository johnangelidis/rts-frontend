export interface AuthUser {
  id: number;
  username: string;
  creationDate: string;
}
export interface Credentials {
  username: string;
  password: string;
}
export interface Favorite {
  id: number;
  userId: number;
  ticker: string;
  openingPrice: number;
}
export interface FinnhubQuote {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}
