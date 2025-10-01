import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { LoginComponent } from './components/login/login';
import { TurnosComponent } from './components/turnos/turnos';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'turnos', component: TurnosComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideZonelessChangeDetection()
  ]
};
