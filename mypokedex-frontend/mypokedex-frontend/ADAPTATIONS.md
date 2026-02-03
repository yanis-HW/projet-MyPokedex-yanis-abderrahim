# Adaptations pour le backend Jakarta EE

Ce document liste les adaptations effectuées pour que le code Angular corresponde exactement au backend Java.

## 🔄 Modifications principales

### 1. Authentification (`core/auth/`)

#### `auth.model.ts`
- ✅ `LoginRequest` : utilise `email` + `password` (au lieu de `username` + `password`)
- ✅ `RegisterRequest` : utilise `name` + `email` + `password` (au lieu de `username` + `email` + `password`)
- ✅ `AuthResponse` : correspond au DTO Java avec `trainerId`, `email`, `name`

#### `auth.service.ts`
- ✅ `login()` : retourne `Observable<AuthResponse>` au lieu de `Observable<AuthUser | void>`
- ✅ `register()` : retourne `Observable<AuthResponse>` au lieu de `Observable<void>`
- ✅ `logout()` : retourne `Observable<string>` (le backend renvoie un message texte)

#### Composants
- ✅ `LoginComponent` : formulaire avec champ `email` au lieu de `username`
- ✅ `RegisterComponent` : formulaire avec champ `name` + `email` au lieu de `username` + `email`

### 2. Pokémons (`features/pokemon/`)

#### `pokemon.model.ts`
- ✅ `Pokemon` : structure complète avec :
  - `id: number`
  - `pokedexNumber: number`
  - `name: string`
  - `hp: number`
  - `attack: number`
  - `defense: number`
  - `speed: number`
  - `types: string[]` (liste des types, pas `typePrimary`/`typeSecondary`)
- ✅ `PokemonComparison` : correspond au DTO Java avec :
  - `pokemons: Pokemon[]`
  - `stats: ComparisonStats` (min/max/avg pour chaque stat)
- ❌ Supprimé : `PokemonComparisonRequest` (le backend attend directement `List<Long>`)

#### `pokemon.service.ts`
- ✅ `comparePokemons()` : accepte `number[]` directement (au lieu d'un objet avec `firstPokemonId`/`secondPokemonId`)

#### Composants
- ✅ `PokemonListComponent` : affiche `pokedexNumber` et `types[]`
- ✅ `PokemonDetailComponent` : affiche toutes les stats (hp, attack, defense, speed) et les types
- ✅ `PokemonCompareComponent` : parse une chaîne d'IDs séparés par des virgules et envoie un tableau `number[]`

## 📋 Endpoints utilisés

Tous les endpoints sont préfixés par `/api` (défini dans `ApplicationConfig.java`) :

- `POST /api/auth/register` → `RegisterRequest` → `AuthResponse`
- `POST /api/auth/login` → `LoginRequest` → `AuthResponse`
- `POST /api/auth/logout` → `{}` → `string`
- `GET /api/pokemons` → `Pokemon[]`
- `GET /api/pokemons/{id}` → `Pokemon`
- `POST /api/pokemons/compare` → `number[]` → `PokemonComparison`

## 🔐 Session HTTP

- L'interceptor `credentials.interceptor.ts` force `withCredentials: true` sur toutes les requêtes
- Le cookie `JSESSIONID` est automatiquement envoyé par le navigateur
- Le backend stocke `trainerId` dans la session HTTP après login

## ⚠️ Notes importantes

1. **Routes protégées** : Toutes les routes `/pokemons` et `/compare` sont protégées par `AuthGuard`
2. **État d'authentification** : Actuellement géré côté front via `BehaviorSubject`. Pour une solution plus robuste, on pourrait ajouter un endpoint de vérification de session côté backend.
3. **Gestion d'erreurs** : Les composants n'implémentent pas encore de gestion d'erreurs complète (à ajouter selon les besoins).
