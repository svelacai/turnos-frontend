import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

/**
 * Componente de autenticación de usuarios.
 * 
 * Proporciona la interfaz de login para que los usuarios puedan
 * autenticarse en el sistema de gestión de turnos.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  /** Nombre de usuario ingresado en el formulario */
  username = '';
  
  /** Contraseña ingresada en el formulario */
  password = '';
  
  /** Mensaje de error mostrado cuando las credenciales son incorrectas */
  error = '';

  /**
   * Constructor del componente.
   * 
   * @param auth Servicio de autenticación para validar credenciales
   * @param router Servicio de routing para navegación entre páginas
   */
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Procesa el intento de login del usuario.
   * 
   * Valida las credenciales usando el AuthService y redirige
   * al usuario a la página de turnos si son correctas,
   * o muestra un mensaje de error si son incorrectas.
   * 
   * @returns void
   */
  login() {
    if (this.auth.login(this.username, this.password)) {
      this.router.navigate(['/turnos']);
    } else {
      this.error = 'Credenciales incorrectas';
    }
  }
}
