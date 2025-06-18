import { Routes } from '@angular/router';
import { loggedInGuard } from './core/logged-in-guard';
import { loggedOutGuard } from './core/logged-out-guard';

export const routes: Routes = [
    { path: 'login', canActivate: [loggedOutGuard], loadComponent: () => import('./features/login/login').then(c => c.Login), title: "Login" },
    { path: 'register', canActivate: [loggedOutGuard], loadComponent: () => import('./features/register/register').then(c => c.Register), title: "Register" },
    { path: 'dashboard', canActivate: [loggedInGuard], loadChildren: () => import('./features/dashboard/dashboard.routes').then(c => c.DashboardRoutes), title: "Dashboard" },
    { path: '**', redirectTo: 'dashboard' }
];
