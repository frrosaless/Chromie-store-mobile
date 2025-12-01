import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter,
  IonButtons, IonMenuButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonList
} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService, Producto, ItemCarrito } from '../services/apiservice';
import { AuthService } from '../pages/perfil/auth.service';
import { ToastController } from '@ionic/angular';

import { LoaderOverlayComponent } from 'src/app/shared/loader-overlay/loader-overlay.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonFooter,
    IonButtons,
    IonMenuButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
    LoaderOverlayComponent, CommonModule, CurrencyPipe, IonList
  ],
})
export class HomePage implements OnInit {
  productos: Producto[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() { }

  // ionViewWillEnter se ejecuta cada vez que la página está a punto de entrar en la vista.
  ionViewWillEnter() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.apiService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (err) => {
        console.error("Error al cargar los productos:", err);
      }
    });
  }

  async agregarProducto(productoId: number) {
    try {
      // 1. Obtenemos el usuario actual de forma asíncrona.
      const usuario = await this.authService.getUserData(); // Usamos el método asíncrono
      console.log('Datos del usuario desde AuthService:', usuario);

      // 2. Verificamos si tenemos un usuario y su username. Si no, lanzamos un error.
      if (!usuario || !usuario.username) {
        throw new Error('Usuario no autenticado o sin username. Por favor, inicie sesión.');
      }

      // 3. Creamos el objeto para agregar al carrito, usando el username del usuario.
      const item: ItemCarrito = { username: usuario.username, producto_id: productoId, cantidad: 1 };
      console.log('Item a agregar al carrito:', item);

      // 4. Agregamos el producto al carrito y esperamos la respuesta de la API.
      await firstValueFrom(this.apiService.agregarOActualizarProducto(item));

      // 5. Si todo va bien, mostramos una notificación de éxito.
      const toast = await this.toastCtrl.create({
        message: 'Producto agregado/actualizado en el carrito',
        duration: 3000,
        color: 'success'
      });
      toast.present();
    } catch (error: any) {
      // 6. Si algo falla, capturamos el error y mostramos una notificación.
      const toast = await this.toastCtrl.create({
        // Si el error tiene una respuesta con 'detail', usamos ese mensaje, que es común en FastAPI.
        message: error?.error?.detail || error.message || 'Error al agregar el producto al carrito.',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
      console.error('Error completo al agregar producto:', error);
      console.error('Detalle del error de la API (422):', JSON.stringify(error.error, null, 2));
    }
  }

  @ViewChild('loader') loader?: LoaderOverlayComponent;

  iniciarCarga(){
    this.loader?.showfor(5000);
  }
}
