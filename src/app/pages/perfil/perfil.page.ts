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
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/pages/perfil/auth.service';
import { LottieComponent } from 'ngx-lottie';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, LottieComponent
  ],
})
export class PerfilPage implements OnInit {

  private authService: AuthService = inject(AuthService);
  username: string = '';
  password: string = '';

  lottieOptions: AnimationOptions = {
    path: '/assets/profileani.json',
    autoplay: true,
    loop: true
  };

  ngOnInit() {
    const userData = this.authService.getUserData();
    console.log('Datos recibidos en PerfilPage desde el servicio:', userData);
    this.username = userData?.username ?? '';
    this.password = userData?.password ?? '';
  }

}
