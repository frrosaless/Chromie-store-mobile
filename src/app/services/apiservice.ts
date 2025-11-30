import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Define las interfaces para que coincidan con los modelos de FastAPI
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  categoria_id: number;
  imagen_url?: string;
}

export interface ItemCarrito {
  id?: number;
  usuario_id: number;
  producto_id: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Asegúrate de que esta URL coincida con la de tu backend.
  // Si pruebas en un dispositivo físico, usa la IP de tu computador (ej: 'http://192.168.1.100:8000').
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  getCarrito(usuario_id: number): Observable<ItemCarrito[]> {
    return this.http.get<ItemCarrito[]>(`${this.apiUrl}/carrito/${usuario_id}`);
  }

  agregarAlCarrito(item: ItemCarrito): Observable<any> {
    return this.http.post(`${this.apiUrl}/carrito/`, item);
  }


}
