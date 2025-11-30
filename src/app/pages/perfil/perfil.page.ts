import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonButton
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/pages/perfil/auth.service';
import { LottieComponent } from 'ngx-lottie';
import { AnimationOptions } from 'ngx-lottie'; 
import { SqliteService, Usuario } from 'src/app/services/sqlite-service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, LottieComponent, IonButton,
    IonCardSubtitle, IonList, IonItem, IonLabel,
  ],
})
export class PerfilPage implements OnInit {

  usuario: Usuario | null = null;
  private authService: AuthService = inject(AuthService);
  private db: SqliteService = inject(SqliteService);


  lottieOptions: AnimationOptions = {
    path: '/assets/profileani.json',
    autoplay: true,
    loop: true
  };

  async ngOnInit() {
    const userData = this.authService.getUserData();
    console.log('Datos recibidos en PerfilPage desde el servicio:', userData);
    if (userData && userData.username) {
      await this.cargarUsuario(userData.username);
    }
  }

  async cargarUsuario(username: string) {
    const usuarios = await this.db.getUsuario(username);
    if (usuarios.length > 0) {
      this.usuario = usuarios[0];
    } else {
      console.error('No se encontró el usuario en la base de datos.');
    }
  }

  
}
