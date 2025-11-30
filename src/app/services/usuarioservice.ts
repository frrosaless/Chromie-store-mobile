import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  username: string;
  password: string;
  email: string;
  name: string;
  lastname: string;
  address: string;
  comuna: string;
  region: string;
}

@Injectable({
  providedIn: 'root',
})
export class Usuarioservice {
  private apiUrl = 'http://127.0.0.1:8000/usuarios';

  constructor(private http: HttpClient) {}

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

}
