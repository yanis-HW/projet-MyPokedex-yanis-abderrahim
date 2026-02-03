import { Injectable } from '@angular/core';

/**
 * Service responsable de la gestion des favoris côté front (localStorage uniquement).
 * Aucune interaction avec le backend.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly storageKey = 'mypokedex-favorites';

  /**
   * Ajoute un Pokémon aux favoris.
   */
  addToFavorites(pokemonId: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      this.saveFavorites(favorites);
    }
  }

  /**
   * Retire un Pokémon des favoris.
   */
  removeFromFavorites(pokemonId: number): void {
    const favorites = this.getFavorites().filter(id => id !== pokemonId);
    this.saveFavorites(favorites);
  }

  /**
   * Indique si un Pokémon est en favoris.
   */
  isFavorite(pokemonId: number): boolean {
    return this.getFavorites().includes(pokemonId);
  }

  /**
   * Récupère la liste des identifiants favoris depuis le localStorage.
   */
  private getFavorites(): number[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as number[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Sauvegarde la liste des identifiants favoris dans le localStorage.
   */
  private saveFavorites(favorites: number[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}

