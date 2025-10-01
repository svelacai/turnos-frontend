import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TurnosComponent } from './turnos';
import { TurnosService } from '../../services/turnos';
import { AuthService } from '../../services/auth';

describe('TurnosComponent', () => {
  let component: TurnosComponent;
  let fixture: ComponentFixture<TurnosComponent>;
  let turnosService: jasmine.SpyObj<TurnosService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const turnosServiceSpy = jasmine.createSpyObj('TurnosService', ['generarTurnos']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuario']);

    await TestBed.configureTestingModule({
      imports: [TurnosComponent, HttpClientTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: TurnosService, useValue: turnosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnosComponent);
    component = fixture.componentInstance;
    turnosService = TestBed.inject(TurnosService) as jasmine.SpyObj<TurnosService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get usuario on init', () => {
    authService.getUsuario.and.returnValue('admin');
    component.ngOnInit();
    expect(component.usuario).toBe('admin');
  });

  it('should generate turnos successfully', () => {
    const mockTurnos = [
      {
        nombreServicio: 'Test Service',
        nombreComercio: 'Test Commerce',
        fecha: '2024-01-01',
        horaInicio: '09:00',
        horaFin: '10:00'
      }
    ];
    
    turnosService.generarTurnos.and.returnValue(of(mockTurnos));
    component.fechaInicio = '2024-01-01';
    component.fechaFin = '2024-01-31';
    component.idServicio = '1';
    
    component.generarTurnos();
    
    expect(turnosService.generarTurnos).toHaveBeenCalledWith({
      fechaInicio: '2024-01-01T00:00:00.000Z',
      fechaFin: '2024-01-31T23:59:59.999Z',
      idServicio: 1
    });
    expect(component.turnos).toEqual(mockTurnos);
  });

  it('should handle error when generating turnos', () => {
    spyOn(console, 'error');
    turnosService.generarTurnos.and.returnValue(throwError(() => ({ status: 500 })));
    component.fechaInicio = '2024-01-01';
    component.fechaFin = '2024-01-31';
    component.idServicio = '1';
    
    component.generarTurnos();
    
    expect(console.error).toHaveBeenCalled();
    expect(component.hasError).toBe(true);
    expect(component.mensaje).toBe('Error interno del servidor');
  });

  it('should handle empty idServicio', () => {
    component.fechaInicio = '2024-01-01';
    component.fechaFin = '2024-01-31';
    component.idServicio = '';
    
    component.generarTurnos();
    
    expect(component.mensaje).toBe('Por favor complete todos los campos');
    expect(component.hasError).toBe(true);
    expect(turnosService.generarTurnos).not.toHaveBeenCalled();
  });
});
