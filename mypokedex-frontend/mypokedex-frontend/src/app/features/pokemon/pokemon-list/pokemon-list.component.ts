import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon.model';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { PokemonSearchComponent } from '../pokemon-search/pokemon-search.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PokemonSearchComponent],
  template: `
    <section class="page">
      <div class="page-header">
        <div>
          <h1>Pokemons</h1>
          <p>Browse the roster, open details, and manage favorites.</p>
        </div>
        <div class="page-actions">
          <button class="btn ghost" (click)="toggleFavorites()">
            {{ favoritesOnly ? 'Show all' : 'Favorites only' }}
          </button>
          <select class="select" [(ngModel)]="sortKey" (change)="applyFilters()">
            <option value="dex">Sort: Pokedex</option>
            <option value="name">Sort: Name</option>
            <option value="hp">Sort: HP</option>
            <option value="attack">Sort: Attack</option>
            <option value="speed">Sort: Speed</option>
          </select>
        </div>
      </div>

      <div class="page-toolbar">
        <app-pokemon-search (search)="onSearch($event)" [suggestions]="suggestions"></app-pokemon-search>
        <div class="chip">Total: {{ filteredPokemons.length }}</div>
      </div>

      <div class="filter-row">
        <label class="field compact">
          <span>Type</span>
          <select class="select" [(ngModel)]="selectedType" (change)="applyFilters()">
            <option value="all">All</option>
            @for (t of typeOptions; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </label>
        <label class="field compact">
          <span>Min HP</span>
          <input type="number" [(ngModel)]="minHp" (input)="applyFilters()" />
        </label>
        <label class="field compact">
          <span>Min ATK</span>
          <input type="number" [(ngModel)]="minAttack" (input)="applyFilters()" />
        </label>
        <label class="field compact">
          <span>Min DEF</span>
          <input type="number" [(ngModel)]="minDefense" (input)="applyFilters()" />
        </label>
        <label class="field compact">
          <span>Min SPD</span>
          <input type="number" [(ngModel)]="minSpeed" (input)="applyFilters()" />
        </label>
      </div>

      <div class="grid cards">
        @for (pokemon of filteredPokemons; track pokemon.id) {
          <article
            class="card"
            [ngClass]="['card-type-' + primaryType(pokemon), isShiny(pokemon) ? 'card-shiny' : '']"
          >
          <div class="card-header">
            <div>
              <div class="card-kicker">#{{ pokemon.pokedexNumber }}</div>
              <h3>{{ pokemon.name }}</h3>
            </div>
            <button
              class="btn pokeball-btn"
              (click)="toggleFavorite(pokemon)"
              [attr.aria-label]="isFavorite(pokemon) ? 'Remove from favorites' : 'Add to favorites'"
              [class.active]="isFavorite(pokemon)"
              [class.capture]="favoriteFlashId === pokemon.id"
            >
              <span class="pokeball" aria-hidden="true"></span>
            </button>
          </div>

          <div class="pokemon-frame">
            <img class="pokemon-avatar" [src]="spriteUrl(pokemon)" [alt]="pokemon.name" loading="lazy" />
          </div>

          @if (isShiny(pokemon)) {
            <div class="shiny-badge">Shiny</div>
          }

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
    </section>
  `
})
export class PokemonListComponent implements OnInit {
  allPokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  searchQuery = '';
  favoritesOnly = false;
  sortKey: 'dex' | 'name' | 'hp' | 'attack' | 'speed' = 'dex';
  typeOptions: string[] = [];
  selectedType = 'all';
  minHp = 0;
  minAttack = 0;
  minDefense = 0;
  minSpeed = 0;
  suggestions: string[] = [];

  maxStats = {
    hp: 1,
    attack: 1,
    defense: 1,
    speed: 1
  };
  favoriteFlashId: number | null = null;

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.allPokemons = pokemons;
      this.typeOptions = this.buildTypeOptions(pokemons);
      this.suggestions = this.buildSuggestions(pokemons);
      this.computeMaxStats();
      this.applyFilters();
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  toggleFavorites(): void {
    this.favoritesOnly = !this.favoritesOnly;
    this.applyFilters();
  }

  toggleFavorite(pokemon: Pokemon): void {
    if (this.isFavorite(pokemon)) {
      this.favoriteService.removeFromFavorites(pokemon.id);
    } else {
      this.favoriteService.addToFavorites(pokemon.id);
      this.favoriteFlashId = pokemon.id;
      setTimeout(() => {
        if (this.favoriteFlashId === pokemon.id) {
          this.favoriteFlashId = null;
        }
      }, 700);
    }
    this.applyFilters();
  }

  isFavorite(pokemon: Pokemon): boolean {
    return this.favoriteService.isFavorite(pokemon.id);
  }

  applyFilters(): void {
    let result = [...this.allPokemons];

    if (this.searchQuery) {
      result = result.filter(pokemon => {
        return (
          pokemon.name.toLowerCase().includes(this.searchQuery) ||
          String(pokemon.pokedexNumber).includes(this.searchQuery)
        );
      });
    }

    if (this.favoritesOnly) {
      result = result.filter(pokemon => this.isFavorite(pokemon));
    }

    if (this.selectedType !== 'all') {
      result = result.filter(pokemon =>
        (pokemon.types || []).some(t => t.toLowerCase() === this.selectedType.toLowerCase())
      );
    }

    result = result.filter(pokemon => {
      return (
        pokemon.hp >= this.minHp &&
        pokemon.attack >= this.minAttack &&
        pokemon.defense >= this.minDefense &&
        pokemon.speed >= this.minSpeed
      );
    });

    result.sort((a, b) => {
      switch (this.sortKey) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'hp':
          return b.hp - a.hp;
        case 'attack':
          return b.attack - a.attack;
        case 'speed':
          return b.speed - a.speed;
        case 'dex':
        default:
          return a.pokedexNumber - b.pokedexNumber;
      }
    });

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

  primaryType(pokemon: Pokemon): string {
    const t = pokemon.types?.[0] ?? 'normal';
    return t.toLowerCase();
  }

  isShiny(pokemon: Pokemon): boolean {
    // Deterministic shiny: ~15% based on id hash, stable across refresh.
    const hash = (pokemon.id * 97 + 13) % 100;
    return hash < 15;
  }

  private buildTypeOptions(pokemons: Pokemon[]): string[] {
    const set = new Set<string>();
    pokemons.forEach(pokemon => {
      (pokemon.types || []).forEach(t => set.add(t));
    });
    return Array.from(set.values()).sort();
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
