import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio para la gestión de turnos.
 * 
 * Proporciona métodos para interactuar con la API backend
 * relacionada con la generación y gestión de turnos.
 */
@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  /** URL base de la API para operaciones de turnos */
  private apiUrl = 'http://localhost:8080/api/turnos';

  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private http: HttpClient) {}

  /**
   * Genera turnos basándose en los parámetros proporcionados.
   * 
   * Realiza una petición POST al endpoint de generación de turnos
   * con los datos especificados (fechas y servicio).
   * 
   * @param data Objeto con los parámetros para generar turnos:
   *             - fechaInicio: Fecha de inicio del rango
   *             - fechaFin: Fecha de fin del rango
   *             - idServicio: ID del servicio para el cual generar turnos
   * @returns Observable con la respuesta estructurada del servidor
   */
  generarTurnos(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar`, data);
  }
}
