import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/apiservice';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonInput, IonItem, IonLabel, IonButtons, IonBackButton],
})
export class RegistroPage implements OnInit {

  username: string = '';
  password: string = '';
  email: string = '';
  name: string = '';
  lastname: string = '';
  address: string = '';
  comuna: string = '';
  region: string = '';


  constructor(
    private apiService: ApiService, 
    private toastCtrl: ToastController, 
    private router: Router
  ) { }

  ngOnInit() {
    // Ya no es necesario inicializar la base de datos aquí.
  }

  guardarRegistro(event: Event) {
    // prevenir el comportamiento por defecto del formulario
    event.preventDefault();

    // Validación de campos obligatorios
    if (!this.username.trim() || !this.password.trim() || !this.email.trim()) {
      this.mostrarToast('Por favor, completa los campos de usuario, contraseña y email.', 'danger');
      return; // Detenemos la ejecución si la validación falla
    }

    const userData = {
      username: this.username,
      password: this.password,
      email: this.email,
      name: this.name || null,
      lastname: this.lastname || null,
      address: this.address || null,
      comuna: this.comuna || null,
      region: this.region || null
    };

    this.apiService.register(userData).pipe(
      catchError(error => {
        // Manejar el error de la API aquí
        this.mostrarToast('Error al registrar. Es posible que el usuario o email ya existan.', 'danger');
        return of(null); // Devuelve un observable nulo para que la cadena no se rompa
      })
    ).subscribe(response => {
      if (response) {
        // Si la respuesta no es nula, el registro fue exitoso
        this.mostrarToast('¡Usuario registrado con éxito!', 'success');
        
        // Limpiar formulario
        this.username = '';
        this.password = '';
        this.email = '';
        this.name = '';
        this.lastname = '';
        this.address = '';
        this.comuna = '';
        this.region = '';

        // Redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }

  async mostrarToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color });
    await toast.present();
  }
}
