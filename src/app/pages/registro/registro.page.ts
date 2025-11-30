import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, ToastController } from '@ionic/angular/standalone';
import { SqliteService } from 'src/app/services/sqlite-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonInput, IonItem, IonLabel, IonButtons, IonBackButton ],
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


  constructor(private db: SqliteService, private toastCtrl: ToastController, private router: Router) { }

  async ngOnInit() {
    await this.db.initDB();

  }

  async guardarRegistro(event: Event) {
    // prevenir el comportamiento por defecto del formulario
    event.preventDefault();
    try {
      // registrar usuario en la base de datos
      await this.db.addUsuario(this.username, this.password, this.email, this.name, this.lastname, this.address, this.comuna, this.region);
      
      const toast = await this.toastCtrl.create({
        message: '¡Usuario registrado con éxito!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      //limpiar formulario
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

    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al registrar el usuario. Es posible que el nombre de usuario ya exista.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }

}
