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
import { LoaderOverlayComponent } from 'src/app/shared/loader-overlay/loader-overlay.component';
import { ApiService } from 'src/app/services/apiservice';
import { AuthService } from 'src/app/pages/perfil/auth.service'; //// Asumiendo que tienes un auth.service
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
  private apiService: ApiService = inject(ApiService);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  lottieOptions: AnimationOptions = {
    path: '/assets/logindragon.json',
    autoplay: true,
    loop: true
  };


  onSubmit() {
    this.loader?.showfor(0);
    if (this.form.invalid) {
      this.loader?.hide();
      this.mostrarToast('Por favor, complete el formulario correctamente.', 'danger');
      return;
    }

    const { username, password } = this.form.value;

    this.apiService.login(username, password).pipe(
      catchError(error => {
        this.loader?.hide();
        this.mostrarToast('Usuario o contraseña incorrectos.', 'danger');
        this.form.controls['password'].reset();
        return of(null); // Detiene la cadena de observables
      })
    ).subscribe(response => {
      this.loader?.hide();
      if (response && response.access_token) {
        this.authService.handleLogin(response.access_token);
        this.router.navigate(['/home']);
      }
    });
  }
  
  iniciarCarga(){
    this.loader?.showfor(5000);
  }

  async mostrarToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color });
    await toast.present();
  }

  irARegistro(){
    this.router.navigate(['/registro']);
  }

}


/*
Usuarios de prueba:
estos tienen articulos en su carrito para probar persistencia
  dawz 123456
  Leox 123456
*/
