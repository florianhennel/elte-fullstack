import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { GameComponent } from './game/game.component';
import { InfoComponent } from './info/info.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { CardsComponent } from './cards/cards.component';
import { CardDetailsComponent } from './cards/card-details/card-details.component';
import { EnemiesComponent } from './enemies/enemies.component';
import { EnemyDetailsComponent } from './enemies/enemy-details/enemy-details.component';
import { LevelsComponent } from './levels/levels.component';
import { LevelDetailsComponent } from './levels/level-details/level-details.component';
import { authGuard } from './_guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'game', component: GameComponent, canActivate: [authGuard] },
  { path: 'cards', component: CardsComponent, canActivate: [authGuard] },
  { path: 'cards/:id', component: CardDetailsComponent, canActivate: [authGuard] },
  { path: 'enemies', component: EnemiesComponent, canActivate: [authGuard] },
  { path: 'enemies/:id', component: EnemyDetailsComponent, canActivate: [authGuard] },
  { path: 'levels', component: LevelsComponent, canActivate: [authGuard] },
  { path: 'levels/:id', component: LevelDetailsComponent, canActivate: [authGuard] },
  { path: 'info', component: InfoComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];
