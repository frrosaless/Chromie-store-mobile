import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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
  username: string;
  producto_id: number;
  cantidad: number;
}

export interface Usuario {
  username: string;
  password: string;
  email: string;
  name?: string | null;
  lastname?: string | null;
  address?: string | null;
  comuna?: string | null;
  region?: string | null;
  id?: number;
}



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Asegúrate de que esta URL coincida con la de tu backend.
  // Si pruebas en un dispositivo físico, usa la IP de tu computador (ej: 'http://192.168.1.100:8000').
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  register(userData: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, userData);
  }

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    // FastAPI con OAuth2 espera los datos en formato x-www-form-urlencoded
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return this.http.post(`${this.apiUrl}/token`, body.toString(), { headers });
  }

  // Método para obtener el perfil del usuario autenticado
  getUserProfile(token: string): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // Llamamos al endpoint /me que obtiene el usuario a partir del token
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/me`, { headers });
  }

  // Nuevo método simple para obtener el perfil por username (menos seguro)
  getUserProfileByUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${username}`);
  }

  // Nuevo método para actualizar el perfil del usuario
  updateUserProfile(usuario: Usuario): Observable<Usuario> {
    // El endpoint para actualizar un usuario es PUT /usuarios/{username}
    // El cuerpo de la petición (body) contiene los datos a actualizar.
    // Es importante que tu API FastAPI esté preparada para recibir estos datos
    // y que no intente modificar campos inmutables como el username o el id.
    const url = `${this.apiUrl}/usuarios/${usuario.username}`;
    
    // Hacemos la petición PUT enviando el objeto de usuario completo.
    return this.http.put<Usuario>(url, usuario);
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  getCarrito(username: string): Observable<ItemCarrito[]> {
    return this.http.get<ItemCarrito[]>(`${this.apiUrl}/carrito/${username}`);
  }

  agregarAlCarrito(item: ItemCarrito): Observable<any> {
    // El backend espera los datos como parámetros de consulta (query parameters), no en el cuerpo.
    const url = new URL(`${this.apiUrl}/carrito/`);
    url.searchParams.append('username', item.username);
    url.searchParams.append('producto_id', item.producto_id.toString());
    url.searchParams.append('cantidad', item.cantidad.toString());

    // Hacemos la solicitud POST a la URL construida, con un cuerpo vacío (null).
    return this.http.post(url.toString(), null);
  }

  /**
   * Método inteligente que decide si agregar un nuevo producto o actualizar la cantidad de uno existente.
   */
  agregarOActualizarProducto(item: ItemCarrito): Observable<any> {
    // 1. Primero, obtenemos el estado actual del carrito para ese usuario.
    return this.getCarrito(item.username).pipe(
      catchError(error => {
        // Si el error es 404 (Not Found), significa que el carrito está vacío.
        // Lo tratamos como un caso válido devolviendo un array vacío.
        if (error.status === 404) {
          return of([]); // 'of([])' crea un observable que emite un array vacío.
        }
        // Si es otro tipo de error, lo relanzamos para que sea manejado por el componente que llama.
        return throwError(() => error);
      }),
      switchMap(itemsEnCarrito => {
        // 2. Buscamos si el producto que queremos agregar ya está en la lista.
        const itemExistente = itemsEnCarrito.find(i => i.producto_id === item.producto_id);

        if (itemExistente) {
          // 3. Si el producto ya existe, llamamos a actualizarCantidad para sumar 1.
          const nuevaCantidad = itemExistente.cantidad + 1;
          return this.actualizarCantidad(item.username, item.producto_id, nuevaCantidad);
        } else {
          // 4. Si el producto no existe, lo agregamos al carrito con cantidad 1.
          return this.agregarAlCarrito({ ...item, cantidad: 1 });
        }
      })
    );
  }

  eliminarDelCarrito(username: string, productoId: number): Observable<any> {
    // El endpoint para eliminar es DELETE /carrito/{username}/producto/{producto_id}
    return this.http.delete(`${this.apiUrl}/carrito/${username}/producto/${productoId}`);
  }

  actualizarCantidad(username: string, productoId: number, nuevaCantidad: number): Observable<ItemCarrito> {
    // Asumimos un endpoint PUT para actualizar la cantidad. El cuerpo lleva la nueva cantidad.
    const url = `${this.apiUrl}/carrito/${username}/producto/${productoId}`;

    // Creamos los parámetros de consulta (query params) que espera FastAPI.
    const params = new HttpParams().set('cantidad', nuevaCantidad.toString());

    // Hacemos la petición PUT enviando los params y con el cuerpo (body) en null.
    return this.http.put<ItemCarrito>(url, null, { params });
  }
}
