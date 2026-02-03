import { Routes } from '@angular/router';

import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PokemonListComponent } from './features/pokemon/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './features/pokemon/pokemon-detail/pokemon-detail.component';
import { PokemonCompareComponent } from './features/pokemon/pokemon-compare/pokemon-compare.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { TeamBuilderComponent } from './features/team/team-builder.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemons',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'pokemons',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PokemonListComponent
      },
      {
        path: ':id',
        component: PokemonDetailComponent
      }
    ]
  },
  {
    path: 'compare',
    component: PokemonCompareComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'team',
    component: TeamBuilderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'pokemons'
  }
];
