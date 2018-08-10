import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthZoneComponent } from './zones/auth-zone/auth-zone';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { InternalZoneComponent } from './zones/internal-zone/internal-zone';
import { SignInComponent } from './pages/sign-in/sign-in';
import { AuthZoneActivation } from './zones/auth-zone/auth-zone.activation';
import { InternalZoneActivation } from './zones/internal-zone/internal-zone.activation';
import { DrawComponent } from './pages/draw/draw';

const appRoutes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '',
    component: AuthZoneComponent,
    canActivate: [AuthZoneActivation],
    children: [
      {
        path: 'sign-in',
        component: SignInComponent
      }
    ]
  },
  {
    path: '',
    component: InternalZoneComponent,
    canActivate: [InternalZoneActivation],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'draw/:id',
        component: DrawComponent
      }
    ]
  },
  {path: '**', redirectTo: 'dashboard'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
