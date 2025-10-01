import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuario = { username: 'admin', password: '1234' };
  private loggedUser: string | null = null;

  login(username: string, password: string): boolean {
    if (username === this.usuario.username && password === this.usuario.password) {
      this.loggedUser = username;
      return true;
    }
    return false;
  }

  getUsuario(): string | null {
    return this.loggedUser;
  }

  logout() {
    this.loggedUser = null;
  }
}
