import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PokemonService } from '../pokemon.service';
import { Pokemon, PokemonComparison } from '../pokemon.model';

@Component({
  selector: 'app-pokemon-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <div class="page-header">
        <div>
          <h1>Compare</h1>
          <p>Pick pokemons by name, by id, or from the list.</p>
        </div>
      </div>

      <div class="compare-panel">
        <form (ngSubmit)="compare()" class="compare-form">
          <label class="field">
            <span>Add by name or id</span>
            <input
              type="text"
              [(ngModel)]="pickerInput"
              name="pickerInput"
              placeholder="Pikachu, 8"
            />
          </label>
          <div class="compare-actions">
            <button class="btn primary" type="button" (click)="addFromInput()">Add</button>
            <button class="btn ghost" type="submit">Compare</button>
            <button class="btn ghost" type="button" (click)="clearSelection()">Clear</button>
          </div>
        </form>

        <div class="selection">
          @if (selectedPokemons.length === 0) {
            <div class="chip muted">No selection yet</div>
          } @else {
            <div class="selection-cards">
              @for (pokemon of selectedPokemons; track pokemon.id) {
                <article class="card selection-card" (click)="removeSelected(pokemon.id)">
                  <div class="card-header">
                    <div>
                      <div class="card-kicker">#{{ pokemon.pokedexNumber }}</div>
                      <h3>{{ pokemon.name }}</h3>
                    </div>
                    <button class="btn ghost small" type="button">Remove</button>
                  </div>
                  <div class="pokemon-frame small">
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
                </article>
              }
            </div>
          }
        </div>
      </div>

      @if (result) {
        <div class="compare-result" #resultSection>
          <h2>Side by side</h2>
          <div class="compare-row">
            @for (pokemon of result.pokemons; track pokemon.id) {
              <article class="card">
            <div class="card-header">
              <div>
                <div class="card-kicker">#{{ pokemon.pokedexNumber }}</div>
                <h3>{{ pokemon.name }}</h3>
              </div>
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
          </article>
            }
          </div>

          @if (result.stats) {
            <div class="compare-stats">
              <h3>Summary</h3>
              <div class="stat-grid">
                <div class="stat"><span>HP</span><strong>{{ result.stats.minHp }} - {{ result.stats.maxHp }}</strong></div>
                <div class="stat"><span>ATK</span><strong>{{ result.stats.minAttack }} - {{ result.stats.maxAttack }}</strong></div>
                <div class="stat"><span>DEF</span><strong>{{ result.stats.minDefense }} - {{ result.stats.maxDefense }}</strong></div>
                <div class="stat"><span>SPD</span><strong>{{ result.stats.minSpeed }} - {{ result.stats.maxSpeed }}</strong></div>
              </div>
            </div>
          }
        </div>
      }

      <div class="compare-filter">
        <div class="search-field">
          <span class="search-icon">SEARCH</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilter()"
            placeholder="Filter list by name or id"
          />
        </div>
      </div>

      @if (filteredPokemons.length > 0) {
        <div class="grid cards">
          @for (pokemon of filteredPokemons; track pokemon.id) {
            <article
              class="card select-card"
              (click)="toggleSelected(pokemon)"
              [class.selected]="isSelected(pokemon.id)"
            >
          <div class="card-header">
            <div>
              <div class="card-kicker">#{{ pokemon.pokedexNumber }}</div>
              <h3>{{ pokemon.name }}</h3>
            </div>
            <span class="select-indicator">{{ isSelected(pokemon.id) ? 'Selected' : 'Tap to add' }}</span>
          </div>
          <div class="pokemon-frame">
            <img class="pokemon-avatar" [src]="spriteUrl(pokemon)" [alt]="pokemon.name" loading="lazy" />
          </div>
          <div class="stat-grid">
            <div class="stat"><span>HP</span><strong>{{ pokemon.hp }}</strong></div>
            <div class="stat"><span>ATK</span><strong>{{ pokemon.attack }}</strong></div>
            <div class="stat"><span>DEF</span><strong>{{ pokemon.defense }}</strong></div>
            <div class="stat"><span>SPD</span><strong>{{ pokemon.speed }}</strong></div>
          </div>
        </article>
          }
        </div>
      }
    </section>
  `
})
export class PokemonCompareComponent implements OnInit {
  @ViewChild('resultSection') resultSection?: ElementRef<HTMLElement>;

  pickerInput = '';
  searchQuery = '';
  result: PokemonComparison | null = null;
  availablePokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  selectedPokemons: Pokemon[] = [];

  constructor(private readonly pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.availablePokemons = pokemons;
      this.filteredPokemons = pokemons;
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredPokemons = this.availablePokemons;
      return;
    }

    this.filteredPokemons = this.availablePokemons.filter(pokemon => {
      return (
        pokemon.name.toLowerCase().includes(query) ||
        String(pokemon.id).includes(query) ||
        String(pokemon.pokedexNumber).includes(query)
      );
    });
  }

  addFromInput(): void {
    const raw = this.pickerInput.trim();
    if (!raw) return;

    const tokens = raw.split(',').map(token => token.trim()).filter(Boolean);
    tokens.forEach(token => {
      const numeric = Number(token);
      if (!Number.isNaN(numeric)) {
        const byId = this.availablePokemons.find(p => p.id === numeric);
        const byDex = this.availablePokemons.find(p => p.pokedexNumber === numeric);
        const pokemon = byId ?? byDex;
        if (pokemon) this.addSelected(pokemon);
        return;
      }

      const byName = this.availablePokemons.find(
        p => p.name.toLowerCase() === token.toLowerCase()
      );
      if (byName) this.addSelected(byName);
    });

    this.pickerInput = '';
  }

  toggleSelected(pokemon: Pokemon): void {
    if (this.isSelected(pokemon.id)) {
      this.removeSelected(pokemon.id);
    } else {
      this.addSelected(pokemon);
    }
  }

  addSelected(pokemon: Pokemon): void {
    if (!this.isSelected(pokemon.id)) {
      this.selectedPokemons = [...this.selectedPokemons, pokemon];
    }
  }

  removeSelected(id: number): void {
    this.selectedPokemons = this.selectedPokemons.filter(pokemon => pokemon.id != id);
  }

  isSelected(id: number): boolean {
    return this.selectedPokemons.some(pokemon => pokemon.id === id);
  }

  clearSelection(): void {
    this.selectedPokemons = [];
    this.pickerInput = '';
    this.result = null;
  }

  statPercent(pokemon: Pokemon, stat: 'hp' | 'attack' | 'defense' | 'speed'): number {
    if (!this.result || this.result.pokemons.length === 0) {
      return 0;
    }

    const max = Math.max(
      ...this.result.pokemons.map(item => {
        switch (stat) {
          case 'hp':
            return item.hp;
          case 'attack':
            return item.attack;
          case 'defense':
            return item.defense;
          case 'speed':
            return item.speed;
        }
      })
    );

    if (max <= 0) return 0;

    let value = 0;
    switch (stat) {
      case 'hp':
        value = pokemon.hp;
        break;
      case 'attack':
        value = pokemon.attack;
        break;
      case 'defense':
        value = pokemon.defense;
        break;
      case 'speed':
        value = pokemon.speed;
        break;
    }

    return Math.min(100, Math.round((value / max) * 100));
  }

  compare(): void {
    if (this.selectedPokemons.length === 0) {
      return;
    }

    const pokemonIds = this.selectedPokemons.map(pokemon => pokemon.id);
    this.pokemonService.comparePokemons(pokemonIds).subscribe(result => {
      this.result = result;
      setTimeout(() => {
        this.resultSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    });
  }

  spriteUrl(pokemon: Pokemon): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;
  }
}
