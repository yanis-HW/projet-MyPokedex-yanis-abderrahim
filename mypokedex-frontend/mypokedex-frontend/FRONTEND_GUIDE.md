# Guide Frontend MyPokedex

Ce document explique comment lancer le front Angular, les pages disponibles et les principales fonctionnalités.

## 1) Prérequis

- Node.js 18+ recommandé
- npm (fourni avec Node)
- Backend disponible sur `http://localhost:8080`

## 2) Installation et démarrage

Depuis `c:\\Users\\ouara\\Documents\\Projet-angular\\mypokedex-frontend\\mypokedex-frontend` :

```bash
npm install
npm start
```

L’application est servie sur :

```
http://localhost:4200
```

### Proxy backend

Le serveur Angular proxy `/api` vers le backend via `proxy.conf.json`.  
Si le backend n’est pas démarré, vous verrez des erreurs proxy.

## 3) Connexion / Inscription

Comptes seedés (exemples) :

- `ash@pokemon.com` / `password1`
- `misty@pokemon.com` / `password2`
- `brock@pokemon.com` / `password3`

## 4) Pages & fonctionnalités

### Pokemons (Liste)
- Recherche avec auto‑complétion
- Filtres (type + stats minimales)
- Tri (pokedex, nom, stats)
- Favoris (Pokéball)
- Badge “Shiny” (déterministe)
- Badges de type + icônes
- Images officielles

### Détail Pokemon
- Image hero
- Barres de stats
- Badges de type
- Favori

### Comparaison
- Ajout par nom / id ou via la liste
- Sélection affichée en cartes
- Comparaison côte à côte avec barres de stats

### Favoris
- Page dédiée
- Recherche et filtrage

### Team Builder
- Équipe de 6 pokemons
- Sauvegarde locale (localStorage)

## 5) Design System

- Thème inspiré Pokémon
- Cartes style Pokédex
- Détails Pokéball
- Barres de stats et gradients par type

## 6) Sources de données

Images officielles (sprites) :

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokedexNumber}.png
```

## 7) Notes utiles

- Authentification par session (cookie JSESSIONID).
- Au logout, redirection vers `/login` et routes protégées bloquées.
- “Shiny” est un badge UI uniquement (pas d’effet backend).

