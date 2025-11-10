import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
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
  IonRouterOutlet,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle
} from '@ionic/angular/standalone';

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
    IonRouterOutlet,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle
  ],
})
export class HomePage {
  constructor() {}
}
