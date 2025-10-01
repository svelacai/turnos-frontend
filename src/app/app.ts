import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente raíz de la aplicación de gestión de turnos.
 * 
 * Este componente actúa como el contenedor principal de la aplicación,
 * proporcionando el punto de entrada para el sistema de routing.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /**
   * Título de la aplicación almacenado como signal.
   * 
   * @protected Signal que contiene el nombre de la aplicación
   * @readonly No puede ser modificado después de la inicialización
   */
  protected readonly title = signal('turnos-frontend');
}
