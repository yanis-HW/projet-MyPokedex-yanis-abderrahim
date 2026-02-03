import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div class="brand">
          <span class="brand-mark">⚡</span>
          <div>
            <div class="brand-title">MyPokedex</div>
            <div class="brand-subtitle">Pocket monster index</div>
          </div>
        </div>

        <div class="pokedex-chip">
          <span class="pokedex-logo" aria-hidden="true"></span>
          <span class="pokedex-label">POKEDEX</span>
          <span class="pokedex-id">
            #{{ (authService.currentUser$ | async)?.trainerId ?? '---' }}
          </span>
        </div>

        <nav class="app-nav">
          <a routerLink="/pokemons" routerLinkActive="active">Pokemons</a>
          <a routerLink="/compare" routerLinkActive="active">Compare</a>
          <a routerLink="/favorites" routerLinkActive="active">Favorites</a>
          <a routerLink="/team" routerLinkActive="active">Team</a>
        </nav>

        <div class="app-actions">
          @if (authService.currentUser$ | async; as user) {
            <div class="user-chip">
              <span class="user-name">{{ user.name || user.email }}</span>
            </div>
            <button class="btn ghost" (click)="logout()">Logout</button>
          } @else {
            <a class="btn ghost" routerLink="/login">Login</a>
            <a class="btn primary" routerLink="/register">Create account</a>
          }
        </div>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <span>MyPokedex • Jakarta EE + Angular</span>
        <span class="footer-sep">•</span>
        <span>Made for demo</span>
      </footer>
    </div>
  `
})
export class AppComponent {
  constructor(
    readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
