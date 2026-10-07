import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { AuthService } from "../../core/services/auth.service";
import { FavoritesService } from "../../core/services/favorites.service";
import { Favorite, FinnhubQuote } from "../../core/models/api.models";
import { MarketService } from "../../core/services/market.service";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  readonly form = new FormGroup({
    symbol: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[a-zA-Z.\-]{1,10}$/),
      ],
    }),
  });
  readonly quote = signal<FinnhubQuote | null>(null);
  readonly searchedSymbol = signal("");
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly favoritesLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);
  private readonly userFavorites = signal<Favorite[]>([]);
  constructor(
    private readonly market: MarketService,
    private readonly favorites: FavoritesService,
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
  ) {}
  ngOnInit(): void {
    const user = this.auth.user();
    if (!user) {
      this.favoritesLoading.set(false);
      return;
    }
    this.favorites.listForUser(user.id).subscribe({
      next: (favorites) => {
        this.userFavorites.set(favorites);
        this.favoritesLoading.set(false);
        const symbol = this.searchedSymbol();
        if (symbol) this.saved.set(this.isFavorite(symbol));
      },
      error: () => this.favoritesLoading.set(false),
    });
  }
  search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const symbol = this.form.getRawValue().symbol.trim().toUpperCase();
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(this.isFavorite(symbol));
    this.market.getQuote(symbol).subscribe({
      next: (quote) => {
        if (quote.c === 0) {
          this.quote.set(null);
          this.searchedSymbol.set(symbol);
          this.saved.set(false);
          this.loading.set(false);
          this.error.set("This ticker does not exist.");
          return;
        }
        this.quote.set(quote);
        this.searchedSymbol.set(symbol);
        this.loading.set(false);
      },
      error: () => {
        this.quote.set(null);
        this.loading.set(false);
        this.error.set(
          "We could not find a quote for that symbol. Check the ticker and try again.",
        );
      },
    });
  }
  saveFavorite(): void {
    const user = this.auth.user();
    const symbol = this.searchedSymbol();
    const openingPrice = this.quote()?.o;
    if (!user || !symbol || openingPrice === undefined || this.saved()) return;
    this.saving.set(true);
    this.favorites.save(user.id, symbol, openingPrice).subscribe({
      next: () => {
        this.userFavorites.update((favorites) => [
          ...favorites,
          { id: 0, userId: user.id, ticker: symbol, openingPrice },
        ]);
        this.saved.set(true);
        this.saving.set(false);
        this.snackBar.open(`${symbol} added to your favorites`, "Dismiss", {
          duration: 3000,
        });
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open("We could not save that favorite.", "Dismiss", {
          duration: 3000,
        });
      },
    });
  }
  private isFavorite(symbol: string): boolean {
    return this.userFavorites().some(
      (favorite) => favorite.ticker.trim().toUpperCase() === symbol,
    );
  }
}
