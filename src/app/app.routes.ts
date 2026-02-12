import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayersComponent } from './components/players/players.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'top-resultados',
    component: PlayersComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
