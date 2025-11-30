import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonButton, ToastController
} from "@ionic/angular/standalone";
import { AuthService } from 'src/app/pages/perfil/auth.service';
import { LoaderOverlayComponent } from 'src/app/shared/loader-overlay/loader-overlay.component';
import { SqliteService } from 'src/app/services/sqlite-service';

import { LottieComponent } from 'ngx-lottie';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderOverlayComponent,
    LottieComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonButton],
})
export class LoginPage {

  @ViewChild('loader') loader?: LoaderOverlayComponent;
  private fb : FormBuilder = inject(FormBuilder);
  private router : Router = inject(Router);
  private toastCtrl : ToastController = inject(ToastController);
  private authService: AuthService = inject(AuthService);
  private sqliteService: SqliteService = inject(SqliteService);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  lottieOptions: AnimationOptions = {
    path: '/assets/logindragon.json',
    autoplay: true,
    loop: true
  };


  async onSubmit() {
    this.loader?.showfor(0);
    if (this.form.invalid) {
      this.loader?.hide();
      const toast = await this.toastCtrl.create({
        message: 'Por favor, complete el formulario correctamente.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const { username, password } = this.form.value;
    const usuarioAutenticado = await this.sqliteService.autenticarUsuario(username, password);
    this.loader?.hide();

    if (usuarioAutenticado) {
      this.authService.setUserData(usuarioAutenticado);
      this.router.navigate(['/home']);
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Usuario o contraseña incorrectos.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      this.form.controls['password'].reset();
    }
  }
  
  iniciarCarga(){
    this.loader?.showfor(5000);
  }

  irARegistro(){
    this.router.navigate(['/registro']);
  }

}
