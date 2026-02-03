import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PokemonService } from '../pokemon/pokemon.service';
import { Pokemon } from '../pokemon/pokemon.model';
import { TeamService } from '../../shared/services/team.service';
import { PokemonSearchComponent } from '../pokemon/pokemon-search/pokemon-search.component';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PokemonSearchComponent],
  template: `
    <section class="page">
      <div class="page-header">
        <div>
          <h1>Team Builder</h1>
          <p>Create your team of 6 pokemons.</p>
        </div>
      </div>

      <div class="team-panel">
        <div class="team-header">
          <h3>Your Team</h3>
          <div class="chip">{{ teamIds.length }}/6</div>
        </div>

        <div class="team-slots">
          @for (slot of teamSlots; track $index) {
            <div class="team-slot">
              @if (teamPokemons[$index]) {
                <div class="slot-card">
                  <div class="card-kicker">#{{ teamPokemons[$index]?.pokedexNumber }}</div>
                  <div class="pokemon-frame small">
                    <img class="pokemon-avatar" [src]="spriteUrl(teamPokemons[$index]!)" [alt]="teamPokemons[$index]?.name" loading="lazy" />
                  </div>
                  <strong>{{ teamPokemons[$index]?.name }}</strong>
                  <button class="btn ghost small" (click)="removeFromTeam(teamPokemons[$index]!.id)">Remove</button>
                </div>
              } @else {
                <div class="slot-empty">Empty slot</div>
              }
            </div>
          }
        </div>

        <div class="team-actions">
          <button class="btn ghost" (click)="clearTeam()">Clear team</button>
        </div>
      </div>

      <div class="page-toolbar">
        <app-pokemon-search (search)="onSearch($event)" [suggestions]="suggestions"></app-pokemon-search>
        <div class="chip">Available: {{ filteredPokemons.length }}</div>
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
              class="btn ghost small"
              [disabled]="!canAdd(pokemon)"
              (click)="addToTeam(pokemon)"
            >
              {{ isInTeam(pokemon) ? 'In team' : 'Add' }}
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
        </article>
        }
      </div>
    </section>
  `
})
export class TeamBuilderComponent implements OnInit {
  allPokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  teamIds: number[] = [];
  teamPokemons: (Pokemon | null)[] = [];
  teamSlots = Array.from({ length: 6 });
  suggestions: string[] = [];
  searchQuery = '';
  maxStats = { hp: 1, attack: 1, defense: 1, speed: 1 };

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamIds = this.teamService.getTeam();
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.allPokemons = pokemons;
      this.filteredPokemons = pokemons;
      this.suggestions = this.buildSuggestions(pokemons);
      this.computeMaxStats();
      this.syncTeam();
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
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
    this.filteredPokemons = result;
  }

  addToTeam(pokemon: Pokemon): void {
    if (!this.canAdd(pokemon)) return;
    this.teamService.addToTeam(pokemon.id);
    this.teamIds = this.teamService.getTeam();
    this.syncTeam();
  }

  removeFromTeam(id: number): void {
    this.teamService.removeFromTeam(id);
    this.teamIds = this.teamService.getTeam();
    this.syncTeam();
  }

  clearTeam(): void {
    this.teamService.clearTeam();
    this.teamIds = [];
    this.syncTeam();
  }

  canAdd(pokemon: Pokemon): boolean {
    return !this.isInTeam(pokemon) && this.teamIds.length < 6;
  }

  isInTeam(pokemon: Pokemon): boolean {
    return this.teamIds.includes(pokemon.id);
  }

  primaryType(pokemon: Pokemon): string {
    const t = pokemon.types?.[0] ?? 'normal';
    return t.toLowerCase();
  }

  isShiny(pokemon: Pokemon): boolean {
    const hash = (pokemon.id * 97 + 13) % 100;
    return hash < 15;
  }

  private syncTeam(): void {
    const byId = new Map(this.allPokemons.map(p => [p.id, p]));
    this.teamPokemons = this.teamIds.map(id => byId.get(id) ?? null);
    while (this.teamPokemons.length < 6) {
      this.teamPokemons.push(null);
    }
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
