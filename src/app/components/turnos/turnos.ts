import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnosService } from '../../services/turnos'; 
import { AuthService } from '../../services/auth';     

/**
 * Interfaz que define la estructura de un turno.
 */
interface TurnoDTO {
  /** Nombre del servicio asociado al turno */
  nombreServicio: string;
  /** Nombre del comercio donde se realiza el turno */
  nombreComercio: string;
  /** Fecha del turno en formato string */
  fecha: string; 
  /** Hora de inicio del turno */
  horaInicio: string;
  /** Hora de finalización del turno */
  horaFin: string;
}

/**
 * Interfaz que define la respuesta del backend.
 */
interface TurnosResponse {
  /** Código de respuesta (1 = error, 0 = éxito) */
  codigo: number;
  /** Mensaje descriptivo de la respuesta */
  mensaje: string;
  /** Lista de turnos generados */
  turnos: TurnoDTO[];
}

/**
 * Componente para la gestión y generación de turnos.
 * 
 * Permite a los usuarios autenticados generar turnos especificando
 * un rango de fechas y un servicio específico.
 */
@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos.html',
  styleUrls: ['./turnos.css']
})
export class TurnosComponent implements OnInit {
  /** Usuario actualmente autenticado */
  usuario: string | null = '';
  
  /** Fecha de inicio para la generación de turnos */
  fechaInicio = '';
  
  /** Fecha de fin para la generación de turnos */
  fechaFin = '';
  
  /** ID del servicio seleccionado (como string del formulario) */
  idServicio = ''; 
  
  /** Lista de turnos generados */
  turnos: TurnoDTO[] = [];
  
  /** Mensaje de respuesta del servidor */
  mensaje = '';
  
  /** Indica si hay un error en la respuesta */
  hasError = false;
  
  /** Indica si se ha ejecutado la generación de turnos */
  turnosGenerados = false;
  
  /** Indica si se está procesando la petición */
  cargando = false;

  /**
   * Constructor del componente.
   * 
   * @param turnosService Servicio para operaciones relacionadas con turnos
   * @param auth Servicio de autenticación para obtener datos del usuario
   */
  constructor(private turnosService: TurnosService, private auth: AuthService) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de la inicialización.
   * 
   * Obtiene el usuario autenticado del servicio de autenticación.
   * 
   * @returns void
   */
  ngOnInit() {
    this.usuario = this.auth.getUsuario();
    this.mensaje = '';
    this.hasError = false;
    this.turnosGenerados = false;
  }

  /**
   * Genera turnos basándose en los parámetros especificados por el usuario.
   * 
   * Toma las fechas de inicio y fin, junto con el ID del servicio,
   * y realiza una petición al backend para generar los turnos correspondientes.
   * Maneja la respuesta del servidor incluyendo códigos de error y mensajes.
   * 
   * @returns void
   */
  generarTurnos() {
    // Validar campos requeridos
    if (!this.fechaInicio || !this.fechaFin || !this.idServicio) {
      this.mensaje = 'Por favor complete todos los campos';
      this.hasError = true;
      return;
    }
    
    // Iniciar carga
    this.cargando = true;
    this.turnosGenerados = true;
    
    const idServicioNum = parseInt(this.idServicio, 10);
    
    // Crear fechas en UTC para evitar problemas de zona horaria
    const fechaInicio = new Date(this.fechaInicio + 'T00:00:00.000Z');
    const fechaFin = new Date(this.fechaFin + 'T23:59:59.999Z');
    
    const data = {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      idServicio: idServicioNum 
    };

    console.log('=== DATOS ENVIADOS AL BACKEND ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('Fecha inicio local:', this.fechaInicio);
    console.log('Fecha fin local:', this.fechaFin);
    console.log('ID Servicio:', idServicioNum);

    this.turnosService.generarTurnos(data).subscribe({
      next: (res: any) => {
        console.log('=== RESPUESTA COMPLETA DEL BACKEND ===');
        console.log(JSON.stringify(res, null, 2));
        console.log('=== TURNOS RECIBIDOS ===');
        if (res.turnos) {
          res.turnos.forEach((turno: any, index: number) => {
            console.log(`Turno ${index + 1}:`, JSON.stringify(turno, null, 2));
          });
        }
        
        this.cargando = false;
        
        // Verificar si la respuesta tiene la estructura esperada
        if (res && typeof res === 'object' && res.hasOwnProperty('codigo')) {
          this.mensaje = res.mensaje || 'Operación completada';
          this.hasError = res.codigo === 1;
          this.turnos = res.turnos || [];
        } else {
          // Si la respuesta no tiene la estructura esperada, tratarla como array de turnos
          this.turnos = Array.isArray(res) ? res : [];
          this.mensaje = this.turnos.length > 0 ? 'Turnos generados exitosamente' : 'No se encontraron turnos';
          this.hasError = false;
        }
        
        console.log('=== TURNOS ASIGNADOS AL COMPONENTE ===');
        console.log('Cantidad:', this.turnos.length);
        this.turnos.forEach((turno: any, index: number) => {
          console.log(`Turno ${index + 1} en componente:`, JSON.stringify(turno, null, 2));
        });
      },
      error: (err) => {
        console.error('Error al generar turnos:', err);
        
        // Determinar tipo de error específico
        if (err.status === 0) {
          this.mensaje = 'No se puede conectar al servidor. Verifique que el backend esté ejecutándose';
        } else if (err.status === 404) {
          this.mensaje = 'Servicio no encontrado';
        } else if (err.status === 500) {
          this.mensaje = 'Error interno del servidor';
        } else if (err.status === 400) {
          this.mensaje = 'Datos enviados incorrectos';
        } else {
          this.mensaje = 'Error de conexión con el servidor';
        }
        
        this.hasError = true;
        this.turnos = [];
        this.cargando = false;
      }
    });
  }
}