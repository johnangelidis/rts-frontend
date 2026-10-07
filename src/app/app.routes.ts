import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/landing/landing.component").then(
        (m) => m.LandingComponent,
      ),
  },
  {
    path: "auth",
    loadComponent: () =>
      import("./pages/auth/auth.component").then((m) => m.AuthComponent),
  },
  {
    path: "search",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/search/search.component").then((m) => m.SearchComponent),
  },
  {
    path: "profile",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/profile/profile.component").then(
        (m) => m.ProfileComponent,
      ),
  },
  { path: "**", redirectTo: "" },
];
