import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurnosService } from './turnos';

describe('TurnosService Error Handling', () => {
  let service: TurnosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(TurnosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle HTTP errors', () => {
    const mockData = {
      fechaInicio: '2024-01-01',
      fechaFin: '2024-01-31',
      idServicio: 1
    };

    service.generarTurnos(mockData).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/turnos/generar');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network errors', () => {
    const mockData = {
      fechaInicio: '2024-01-01',
      fechaFin: '2024-01-31',
      idServicio: 1
    };

    service.generarTurnos(mockData).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.error).toBeInstanceOf(ProgressEvent);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/turnos/generar');
    req.error(new ProgressEvent('Network error'));
  });
});