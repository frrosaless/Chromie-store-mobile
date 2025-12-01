import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData: any = null;
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {
    this.loadToken();
  }

  // Carga el token desde localStorage al iniciar el servicio
  private loadToken() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // Al cargar, solo decodificamos el token para tener el username temporalmente.
      try {
        const decodedToken: any = jwtDecode(token);
        this.userData = { username: decodedToken.sub };
      } catch (error) {
        this.logout();
      }
    }
  }

  // Esta es la función que faltaba. Guarda el token y decodifica los datos del usuario.
  handleLogin(token: string) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      const decodedToken: any = jwtDecode(token);
      this.userData = { username: decodedToken.sub }; // Guardamos temporalmente el username
    } catch (error) {
      console.error('Error al decodificar el token', error);
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userData = null;
  }

  isAuthenticated(): boolean {
    return this.userData !== null;
  }

  getUserData() {
    return this.userData;
  }

  // Nuevo método para actualizar los datos del usuario desde la API
  setUserData(data: any) {
    this.userData = data;
  }

  getUserId(): number | null {
    return this.userData ? this.userData.id : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
