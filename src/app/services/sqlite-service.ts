import { Injectable } from '@angular/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export interface Usuario {
  username: string;
  password: string;
  email: string;
  name: string;
  lastname: string;
  address: string;
  comuna: string;
  region: string;
}

export interface Categoria {
  nombre: string;
  descripcion: string;
}

export interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaId: number;
} 


@Injectable({
  providedIn: 'root',
})
export class SqliteService {

  private db!: SQLiteDBConnection;
  readonly db_name: string = 'chromiestore.db';
  readonly db_table_usuario: string = 'usuario';
  readonly db_table_categoria: string = 'categoria';
  readonly db_table_producto: string = 'producto';
  readonly db_table_carrito: string = 'carrito';



  private sqlite: SQLiteConnection;

  private isInitialized: boolean = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDB(){
    if (this.isInitialized) return;

    try {
      this.db = await this.sqlite.createConnection(
        this.db_name, false, 'no-encryption', 1, false
      

      );
      await this.db.open();
      console.log('Base de datos inicializada');
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${this.db_table_usuario} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT NOT NULL,
          name TEXT NOT NULL,
          lastname TEXT NOT NULL,
          address TEXT NOT NULL,
          comuna TEXT NOT NULL,
          region TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ${this.db_table_categoria} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          descripcion TEXT
        );
        
        CREATE TABLE IF NOT EXISTS ${this.db_table_producto} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          precio REAL NOT NULL,
          categoriaId INTEGER NOT NULL,
          FOREIGN KEY (categoriaId) REFERENCES ${this.db_table_categoria}(id)
        );
        CREATE TABLE IF NOT EXISTS ${this.db_table_carrito} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          productoId INTEGER NOT NULL,
          usuarioId INTEGER NOT NULL,
          cantidad INTEGER NOT NULL,
          FOREIGN KEY (productoId) REFERENCES ${this.db_table_producto}(id),
          FOREIGN KEY (usuarioId) REFERENCES ${this.db_table_usuario}(id)
        );
      `;
      await this.db.execute(createTableQuery);
      this.isInitialized = true;
      console.log('Tablas creadas o verificadas con éxito');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  async addUsuario(username: string, password: string, email: string, name: string, lastname: string, address: string, comuna: string, region: string){
    try {
      if (!username || !password || !email || !name || !lastname || !address || !comuna || !region) {
        alert('Todos los campos son obligatorios');
        return
      }
      const insertQuery = `
        INSERT INTO ${this.db_table_usuario} (username, password, email, name, lastname, address, comuna, region)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const values = [username, password, email, name, lastname, address, comuna, region];
      await this.db.run(insertQuery, values);
      console.log('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error; // Lanzar el error para que la página de registro pueda capturarlo
    }
      
  }

  async autenticarUsuario(username: string, password: string): Promise<Usuario | null> {
    try {
      const selectQuery = `SELECT * FROM ${this.db_table_usuario} WHERE username = ? AND password = ?;`;
      const result = await this.db.query(selectQuery, [username, password]);
      if (result.values && result.values.length > 0) {
        console.log('Autenticación exitosa para:', username);
        return result.values[0] as Usuario;
      }
      return null;
    } catch (error) {
      console.error('Error en la autenticación:', error);
      return null;
    }
  }

  async getUsuario(username: string) {
    try {
      const selectQuery = `SELECT * FROM ${this.db_table_usuario} WHERE username=?;`;
      const result = await this.db.query(selectQuery, [username]);
      return result.values as Usuario[];
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return [];
    }
  }
      

  async editUsuario(id: number, username: string, password: string, email: string, name: string, lastname: string, address: string, comuna: string, region: string){
    try {
      const updateQuery = `
        UPDATE ${this.db_table_usuario}
        SET username = ?, password = ?, email = ?, name = ?, lastname = ?, address = ?, comuna = ?, region = ?
        WHERE id = ?;
      `;
      const values = [username, password, email, name, lastname, address, comuna, region, id];
      await this.db.run(updateQuery, values);
      console.log('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }


  

}
