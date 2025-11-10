import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, ToastController } from "@ionic/angular";
import { AuthService } from 'src/app/pages/perfil/auth.service';
import { LoaderOverlayComponent } from 'src/app/shared/loader-overlay/loader-overlay.component';

import { LottieComponent } from 'ngx-lottie';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, LoaderOverlayComponent, LottieComponent],
})
export class LoginPage {

  @ViewChild('loader') loader?: LoaderOverlayComponent;
  private fb : FormBuilder = inject(FormBuilder);
  private router : Router = inject(Router);
  private toastCtrl : ToastController = inject(ToastController);
  private authService: AuthService = inject(AuthService);

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
    if (this.form.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, complete el formulario correctamente.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }
    const { username, password } = this.form.value;

    this.authService.setUserData({ username, password });
    this.router.navigate(['/home']);
  }
  
  iniciarCarga(){
    this.loader?.showfor(5000);
  }

}
