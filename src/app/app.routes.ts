import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayersComponent } from './components/players/players.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'top-resultados',
    component: PlayersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
