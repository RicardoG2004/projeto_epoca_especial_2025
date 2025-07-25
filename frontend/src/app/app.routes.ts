import { Routes } from '@angular/router';
import { LoginPage } from './login.page';
import { RegisterPage } from './register.page';
import { DashboardPage } from './dashboard.page';
import { ForecastPage } from './forecast.page';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'forecast', component: ForecastPage, canActivate: [authGuard] },
];
