import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput, IonCol, IonGrid, IonRow, IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/pages/perfil/auth.service';
import { ApiService, Usuario } from 'src/app/services/apiservice';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { addIcons } from 'ionicons';
import { mapOutline } from 'ionicons/icons';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonCardSubtitle,
    IonList, IonItem, IonLabel, IonInput, IonCol, IonGrid, IonRow, IonIcon, LottieComponent, MapaModalPage
  ],  
  providers: [
    ModalController
  ]
})
export class PerfilPage implements OnInit {

  usuario: Usuario | null = null;
  usuarioEditable: Usuario | null = null;
  isEditing = false;
  private authService: AuthService = inject(AuthService);
  private apiService = inject(ApiService);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef); // 1. Inyectar ChangeDetectorRef

  lottieOptions: AnimationOptions = {
    path: '/assets/profileani.json',
    autoplay: true,
    loop: true
  };

  constructor() {
    addIcons({ mapOutline });
  }
  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    // 1. Obtenemos los datos guardados en el servicio (que tiene el username)
    const localUserData = this.authService.getUserData();

    // 2. Verificamos que tengamos un username
    if (localUserData && localUserData.username) {
      // 3. Llamamos al nuevo método que busca por nombre de usuario
      this.apiService.getUserProfileByUsername(localUserData.username).subscribe({
        next: (userData) => {
          this.usuario = userData;
          this.authService.setUserData(userData);
        },
        error: (err) => {
          console.error('Error al obtener el perfil del usuario', err);
        }
      });
    }
  }

  async abrirMapa() {
    const modal = await this.modalCtrl.create({
      component: MapaModalPage,
    });

    await modal.present();

    // Esperar a que el modal se cierre y obtener los datos
    const { data } = await modal.onWillDismiss();

    if (data && this.usuarioEditable) {
      // Asignamos la dirección, comuna y región obtenidas del mapa
      this.usuarioEditable.address = data.address;
      this.usuarioEditable.comuna = data.comuna;
      this.usuarioEditable.region = data.region;

      // 2. Forzar la detección de cambios para actualizar la vista
      this.cdr.detectChanges();
    }
  }
  iniciarEdicion() {
    // Clonamos el objeto de usuario para no modificar el original hasta guardar
    this.usuarioEditable = JSON.parse(JSON.stringify(this.usuario));
    this.isEditing = true;
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.usuarioEditable = null;
  }

  guardarCambios() {
    if (this.usuarioEditable) {
      // Aquí asumimos que tienes un método `updateUserProfile` en tu ApiService
      // que recibe el objeto de usuario y lo actualiza en el backend.
      this.apiService.updateUserProfile(this.usuarioEditable).subscribe({ // Asegúrate que tu API espera 'address'
        next: (updatedUser) => {
          this.usuario = updatedUser;
          this.authService.setUserData(updatedUser); // Actualizamos también en el servicio de autenticación
          this.isEditing = false;
          this.usuarioEditable = null;
        },
        error: (err) => console.error('Error al actualizar el perfil', err)
      });
    }
  }
}
