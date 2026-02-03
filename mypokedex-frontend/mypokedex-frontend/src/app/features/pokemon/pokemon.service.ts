import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pokemon, PokemonComparison } from './pokemon.model';

/**
 * Service responsable des appels REST liés aux Pokémons.
 * Toute la logique d'accès aux données est centralisée ici.
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly apiBaseUrl = '/api/pokemons';

  constructor(private readonly http: HttpClient) {}

  /**
   * Récupère tous les Pokémons.
   * GET /api/pokemons
   */
  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiBaseUrl);
  }

  /**
   * Récupère un Pokémon par son identifiant.
   * GET /api/pokemons/{id}
   */
  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiBaseUrl}/${id}`);
  }

  /**
   * Compare plusieurs Pokémons.
   * POST /api/pokemons/compare
   * Le backend attend une List<Long> (number[] en TypeScript).
   */
  comparePokemons(pokemonIds: number[]): Observable<PokemonComparison> {
    return this.http.post<PokemonComparison>(
      `${this.apiBaseUrl}/compare`,
      pokemonIds
    );
  }
}

