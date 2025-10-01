import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { LoginComponent } from '../components/login/login';
import { TurnosComponent } from '../components/turnos/turnos';
import { AuthService } from '../services/auth';

@Component({
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet]
})
class TestHostComponent {}

describe('App Integration Tests', () => {
  let router: Router;
  let location: Location;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        LoginComponent,
        TurnosComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'login', component: LoginComponent },
          { path: 'turnos', component: TurnosComponent },
          { path: '', redirectTo: '/login', pathMatch: 'full' }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
  });

  it('should navigate from login to turnos after successful authentication', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/login']);
    expect(location.path()).toBe('/login');

    // Simulate successful login
    const loginResult = authService.login('admin', '1234');
    expect(loginResult).toBe(true);

    await router.navigate(['/turnos']);
    expect(location.path()).toBe('/turnos');
    expect(authService.getUsuario()).toBe('admin');
  });

  it('should redirect to login when accessing root path', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['']);
    expect(location.path()).toBe('/login');
  });
});