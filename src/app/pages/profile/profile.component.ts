import { DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Favorite } from "../../core/models/api.models";
import { AuthService } from "../../core/services/auth.service";
import { FavoritesService } from "../../core/services/favorites.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  readonly favorites = signal<Favorite[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly removing = signal<number | null>(null);
  constructor(
    readonly auth: AuthService,
    private readonly favoriteService: FavoritesService,
    private readonly snackBar: MatSnackBar,
  ) {}
  ngOnInit(): void {
    this.loadFavorites();
  }
  loadFavorites(): void {
    const user = this.auth.user();
    if (!user) return;
    this.loading.set(true);
    this.favoriteService.listForUser(user.id).subscribe({
      next: (favorites) => {
        this.favorites.set(favorites);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("We could not load your favorites.");
        this.loading.set(false);
      },
    });
  }
  remove(favoriteId: number): void {
    this.removing.set(favoriteId);
    this.favoriteService.remove(favoriteId).subscribe({
      next: () => {
        this.favorites.update((items) =>
          items.filter((item) => item.id !== favoriteId),
        );
        this.removing.set(null);
        this.snackBar.open("Favorite removed", "Dismiss", { duration: 2500 });
      },
      error: () => {
        this.removing.set(null);
        this.snackBar.open("We could not remove that favorite.", "Dismiss", {
          duration: 3000,
        });
      },
    });
  }
}
