import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { LoginRequest } from '../../../core/auth/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Welcome back</h2>
          <p>Sign in to explore your Pokemon roster.</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <label class="field">
            <span>Email</span>
            <input type="email" [(ngModel)]="email" name="email" placeholder="ash@pokemon.com" />
          </label>

          <label class="field">
            <span>Password</span>
            <input type="password" [(ngModel)]="password" name="password" placeholder="********" />
          </label>

          <button class="btn primary full" type="submit" [disabled]="isSubmitting">
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </button>

          @if (errorMessage) {
            <p class="form-error">{{ errorMessage }}</p>
          }
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    const payload: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/pokemons']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Invalid credentials or server unreachable.';
      }
    });
  }
}
