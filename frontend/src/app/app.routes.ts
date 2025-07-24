import { Routes } from '@angular/router';
import { ApiDemoPage } from './api-demo.page';
import { LoginPage } from './login.page';
import { RegisterPage } from './register.page';
import { DashboardPage } from './dashboard.page';
import { authGuard } from './auth.guard';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'api-demo', component: ApiDemoPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard],
  },
];
