import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon.model';
import { FavoriteService } from '../../../shared/services/favorite.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (pokemon) {
      <section class="page">
        <a class="back-link" routerLink="/pokemons">< Back to list</a>

      <div class="detail-card">
        <div class="detail-main">
          <div class="detail-title">
            <div class="card-kicker">#{{ pokemon.pokedexNumber }}</div>
            <h1>{{ pokemon.name }}</h1>
          </div>

          <img class="pokemon-hero" [src]="spriteUrl(pokemon)" [alt]="pokemon.name" loading="lazy" />

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

          <div class="stat-grid large">
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
        </div>

        <div class="detail-side">
          <div class="badge-block">
            <div class="badge">Battle ready</div>
            <div class="badge">Captured</div>
          </div>

          <button class="btn primary" (click)="toggleFavorite()" [class.capture]="favoriteJustAdded">
            {{ isFavorite() ? 'Remove from favorites' : 'Add to favorites' }}
          </button>
        </div>
      </div>
    </section>
    }
  `
})
export class PokemonDetailComponent implements OnInit {
  pokemon: Pokemon | null = null;
  maxStats = { hp: 1, attack: 1, defense: 1, speed: 1 };
  favoriteJustAdded = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pokemonService: PokemonService,
    private readonly favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!isNaN(id)) {
      this.pokemonService.getPokemon(id).subscribe(pokemon => {
        this.pokemon = pokemon;
      });
    }

    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.maxStats = pokemons.reduce(
        (acc, item) => {
          acc.hp = Math.max(acc.hp, item.hp);
          acc.attack = Math.max(acc.attack, item.attack);
          acc.defense = Math.max(acc.defense, item.defense);
          acc.speed = Math.max(acc.speed, item.speed);
          return acc;
        },
        { hp: 1, attack: 1, defense: 1, speed: 1 }
      );
    });
  }

  toggleFavorite(): void {
    if (!this.pokemon) {
      return;
    }

    if (this.isFavorite()) {
      this.favoriteService.removeFromFavorites(this.pokemon.id);
    } else {
      this.favoriteService.addToFavorites(this.pokemon.id);
      this.favoriteJustAdded = true;
      setTimeout(() => {
        this.favoriteJustAdded = false;
      }, 700);
    }
  }

  isFavorite(): boolean {
    return this.pokemon ? this.favoriteService.isFavorite(this.pokemon.id) : false;
  }

  statPercent(pokemon: Pokemon, stat: 'hp' | 'attack' | 'defense' | 'speed'): number {
    const max = this.maxStats[stat] || 1;
    const value = pokemon[stat];
    return Math.min(100, Math.round((value / max) * 100));
  }

  spriteUrl(pokemon: Pokemon): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;
  }
}
