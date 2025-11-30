import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonButton, IonFooter } from '@ionic/angular/standalone';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonButton, IonFooter],
})
export class CarritoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
