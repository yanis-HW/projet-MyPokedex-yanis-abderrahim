import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PokemonService } from '../pokemon/pokemon.service';
import { Pokemon } from '../pokemon/pokemon.model';
import { FavoriteService } from '../../shared/services/favorite.service';
import { PokemonSearchComponent } from '../pokemon/pokemon-search/pokemon-search.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PokemonSearchComponent],
  template: `
    <section class="page">
      <div class="page-header">
        <div>
          <h1>Favorites</h1>
          <p>Your favorite Pokemons in one place.</p>
        </div>
      </div>

      <div class="page-toolbar">
        <app-pokemon-search (search)="onSearch($event)" [suggestions]="suggestions"></app-pokemon-search>
        <div class="chip">Total: {{ filteredPokemons.length }}</div>
      </div>

      @if (filteredPokemons.length > 0) {
        <div class="grid cards">
          @for (pokemon of filteredPokemons; track pokemon.id) {
            <article class="card">
          <div class="card-header">
            <div>
              <div class="card-kicker">#{{ pokemon.pokedexNumber }}</div>
              <h3>{{ pokemon.name }}</h3>
            </div>
            <button
              class="btn pokeball-btn active"
              (click)="removeFavorite(pokemon)"
              aria-label="Remove from favorites"
            >
              <span class="pokeball" aria-hidden="true"></span>
            </button>
          </div>

          <div class="pokemon-frame">
            <img class="pokemon-avatar" [src]="spriteUrl(pokemon)" [alt]="pokemon.name" loading="lazy" />
          </div>

          @if (pokemon.types && pokemon.types.length > 0) {
            <div class="type-row">
              @for (t of pokemon.types; track t) {
                <span class="type-pill" [ngClass]="'type-' + t.toLowerCase()">
                  <span class="type-icon" [ngClass]="'type-icon-' + t.toLowerCase()"></span>
                  {{ t }}
                </span>
              }
            </div>
          }

          <div class="stat-grid">
            <div class="stat">
              <div class="stat-label"><span>HP</span><strong>{{ pokemon.hp }}</strong></div>
              <div class="stat-bar"><span class="stat-fill" [style.width.%]="statPercent(pokemon, 'hp')"></span></div>
            </div>
            <div class="stat">
              <div class="stat-label"><span>ATK</span><strong>{{ pokemon.attack }}</strong></div>
              <div class="stat-bar"><span class="stat-fill" [style.width.%]="statPercent(pokemon, 'attack')"></span></div>
            </div>
            <div class="stat">
              <div class="stat-label"><span>DEF</span><strong>{{ pokemon.defense }}</strong></div>
              <div class="stat-bar"><span class="stat-fill" [style.width.%]="statPercent(pokemon, 'defense')"></span></div>
            </div>
            <div class="stat">
              <div class="stat-label"><span>SPD</span><strong>{{ pokemon.speed }}</strong></div>
              <div class="stat-bar"><span class="stat-fill" [style.width.%]="statPercent(pokemon, 'speed')"></span></div>
            </div>
          </div>

          <div class="card-actions">
            <a class="btn primary" [routerLink]="['/pokemons', pokemon.id]">Open details</a>
          </div>
        </article>
          }
        </div>
      } @else {
        <div class="empty-state">
          <h3>No favorites yet</h3>
          <p>Add favorites from the Pokemons list.</p>
          <a class="btn primary" routerLink="/pokemons">Go to Pokemons</a>
        </div>
      }
    </section>
  `
})
export class FavoritesComponent implements OnInit {
  allPokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  suggestions: string[] = [];
  searchQuery = '';
  maxStats = { hp: 1, attack: 1, defense: 1, speed: 1 };

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.allPokemons = pokemons;
      this.suggestions = this.buildSuggestions(pokemons);
      this.computeMaxStats();
      this.applyFilters();
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  removeFavorite(pokemon: Pokemon): void {
    this.favoriteService.removeFromFavorites(pokemon.id);
    this.applyFilters();
  }

  applyFilters(): void {
    const favorites = this.allPokemons.filter(pokemon => this.favoriteService.isFavorite(pokemon.id));
    let result = [...favorites];
    if (this.searchQuery) {
      result = result.filter(pokemon => {
        return (
          pokemon.name.toLowerCase().includes(this.searchQuery) ||
          String(pokemon.pokedexNumber).includes(this.searchQuery)
        );
      });
    }
    this.filteredPokemons = result;
  }

  computeMaxStats(): void {
    this.maxStats = this.allPokemons.reduce(
      (acc, pokemon) => {
        acc.hp = Math.max(acc.hp, pokemon.hp);
        acc.attack = Math.max(acc.attack, pokemon.attack);
        acc.defense = Math.max(acc.defense, pokemon.defense);
        acc.speed = Math.max(acc.speed, pokemon.speed);
        return acc;
      },
      { hp: 1, attack: 1, defense: 1, speed: 1 }
    );
  }

  statPercent(pokemon: Pokemon, stat: 'hp' | 'attack' | 'defense' | 'speed'): number {
    const max = this.maxStats[stat] || 1;
    const value = pokemon[stat];
    return Math.min(100, Math.round((value / max) * 100));
  }

  spriteUrl(pokemon: Pokemon): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;
  }

  private buildSuggestions(pokemons: Pokemon[]): string[] {
    const set = new Set<string>();
    pokemons.forEach(pokemon => {
      set.add(pokemon.name);
      set.add(String(pokemon.pokedexNumber));
    });
    return Array.from(set.values()).sort();
  }
}
