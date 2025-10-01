import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private apiUrl = 'http://localhost:8080/api/turnos';

  constructor(private http: HttpClient) {}

  generarTurnos(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar`, data);
  }
}
