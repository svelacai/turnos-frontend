import { Injectable } from '@angular/core';

/**
 * Servicio de autenticación para la gestión de usuarios.
 * 
 * Proporciona funcionalidades para login, logout y obtención
 * de información del usuario autenticado.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Credenciales válidas para el sistema (hardcodeadas para demo) */
  private usuario = { username: 'admin', password: '1234' };
  
  /** Usuario actualmente autenticado */
  private loggedUser: string | null = null;

  /**
   * Autentica un usuario con las credenciales proporcionadas.
   * 
   * @param username Nombre de usuario
   * @param password Contraseña del usuario
   * @returns true si las credenciales son válidas, false en caso contrario
   */
  login(username: string, password: string): boolean {
    if (username === this.usuario.username && password === this.usuario.password) {
      this.loggedUser = username;
      return true;
    }
    return false;
  }

  /**
   * Obtiene el nombre del usuario actualmente autenticado.
   * 
   * @returns El nombre del usuario autenticado o null si no hay usuario logueado
   */
  getUsuario(): string | null {
    return this.loggedUser;
  }

  /**
   * Cierra la sesión del usuario actual.
   * 
   * Limpia la información del usuario autenticado.
   * 
   * @returns void
   */
  logout() {
    this.loggedUser = null;
  }
}
