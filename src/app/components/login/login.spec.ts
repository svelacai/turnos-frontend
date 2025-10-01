import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and navigate', () => {
    authService.login.and.returnValue(true);
    component.username = 'admin';
    component.password = '1234';
    
    component.login();
    
    expect(authService.login).toHaveBeenCalledWith('admin', '1234');
    expect(router.navigate).toHaveBeenCalledWith(['/turnos']);
    expect(component.error).toBe('');
  });

  it('should show error on failed login', () => {
    authService.login.and.returnValue(false);
    component.username = 'wrong';
    component.password = 'wrong';
    
    component.login();
    
    expect(authService.login).toHaveBeenCalledWith('wrong', 'wrong');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.error).toBe('Credenciales incorrectas');
  });
});
