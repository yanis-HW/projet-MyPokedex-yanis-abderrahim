import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { RegisterRequest } from '../../../core/auth/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Create account</h2>
          <p>Join the league and build your team.</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <label class="field">
            <span>Name</span>
            <input type="text" [(ngModel)]="name" name="name" placeholder="Ash Ketchum" />
          </label>

          <label class="field">
            <span>Email</span>
            <input type="email" [(ngModel)]="email" name="email" placeholder="ash@pokemon.com" />
          </label>

          <label class="field">
            <span>Password</span>
            <input type="password" [(ngModel)]="password" name="password" placeholder="********" />
          </label>

          <button class="btn primary full" type="submit" [disabled]="isSubmitting">
            {{ isSubmitting ? 'Creating account...' : 'Create account' }}
          </button>

          @if (errorMessage) {
            <p class="form-error">{{ errorMessage }}</p>
          }
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
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

    const payload: RegisterRequest = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Registration failed. Try a different email.';
      }
    });
  }
}
