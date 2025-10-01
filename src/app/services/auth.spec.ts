import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with correct credentials', () => {
    const result = service.login('admin', '1234');
    expect(result).toBe(true);
    expect(service.getUsuario()).toBe('admin');
  });

  it('should not login with incorrect credentials', () => {
    const result = service.login('wrong', 'wrong');
    expect(result).toBe(false);
    expect(service.getUsuario()).toBe(null);
  });

  it('should logout user', () => {
    service.login('admin', '1234');
    service.logout();
    expect(service.getUsuario()).toBe(null);
  });
});
