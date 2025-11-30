import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter,
  IonButtons, IonMenuButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonList
} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService, Producto } from '../services/apiservice';
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

  ngOnInit() {
    this.apiService.getProductos().subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }

  async agregarProducto(productoId: number) {
    const userData = this.authService.getUserData();
    if (!userData || !userData.username) {
      // Manejar caso donde no hay usuario logeado
      console.error('No hay un usuario logeado para agregar al carrito');
      return;
    }

    const item = {usuario_id: userData.id, producto_id: productoId, cantidad: 1 };
    
    this.apiService.agregarAlCarrito(item).subscribe(async res => {
      console.log(res);
      const toast = await this.toastCtrl.create({
        message: 'Producto agregado al carrito',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    });
  }

  @ViewChild('loader') loader?: LoaderOverlayComponent;

  iniciarCarga(){
    this.loader?.showfor(5000);
  }
}
