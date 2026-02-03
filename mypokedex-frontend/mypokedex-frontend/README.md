# MyPokedex Frontend

Front Angular du projet MyPokedex.

## Prérequis

- Node.js 18+ recommandé
- npm
- Backend disponible sur `http://localhost:8080`

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm start
```

Ouvrir :

```
http://localhost:4200
```

## Proxy API

Le front proxy `/api` vers le backend via `proxy.conf.json`.
Si le backend n’est pas lancé, l’UI affichera des erreurs proxy.

## Comptes de test

- `ash@pokemon.com` / `password1`
- `misty@pokemon.com` / `password2`
- `brock@pokemon.com` / `password3`

## Pages principales

- `/login` : connexion
- `/register` : inscription
- `/pokemons` : liste
- `/pokemons/:id` : détail
- `/compare` : comparaison
- `/favorites` : favoris
- `/team` : team builder

## Notes

Voir `FRONTEND_GUIDE.md` pour la documentation détaillée.

