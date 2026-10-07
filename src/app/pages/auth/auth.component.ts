import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  readonly mode = signal<"login" | "signup">("login");
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = new FormGroup({
    username: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}
  selectMode(index: number): void {
    this.mode.set(index === 0 ? "login" : "signup");
    this.error.set(null);
    this.form.reset();
  }
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const request =
      this.mode() === "login"
        ? this.auth.login(this.form.getRawValue())
        : this.auth.signUp(this.form.getRawValue());
    request.subscribe({
      next: () => this.router.navigate(["/search"]),
      error: (error: { status?: number }) => {
        this.loading.set(false);
        this.error.set(
          error.status === 409
            ? "That username is already in use."
            : "We could not complete that request. Check your details and try again.",
        );
      },
    });
  }
}
