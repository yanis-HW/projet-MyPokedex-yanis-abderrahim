/**
 * Modèles principaux liés aux Pokémons.
 * Ces interfaces correspondent exactement aux entités/DTOs du backend Java.
 * 
 * Le backend retourne :
 * - Pokemon : id, pokedexNumber, name, hp, attack, defense, speed, types[]
 * - PokemonComparison : pokemons[], stats (ComparisonStats)
 */

export interface Pokemon {
  id: number;
  pokedexNumber: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  types: string[];
}

/**
 * Résultat de la comparaison de Pokémons.
 * Correspond au DTO PokemonComparison du backend Java.
 */
export interface PokemonComparison {
  pokemons: Pokemon[];
  stats: ComparisonStats;
}

export interface ComparisonStats {
  minHp: number;
  maxHp: number;
  avgHp: number;
  minAttack: number;
  maxAttack: number;
  avgAttack: number;
  minDefense: number;
  maxDefense: number;
  avgDefense: number;
  minSpeed: number;
  maxSpeed: number;
  avgSpeed: number;
}

