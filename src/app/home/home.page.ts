import { Component, inject, ViewChild } from '@angular/core';
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

import { LoaderOverlayComponent } from 'src/app/shared/loader-overlay/loader-overlay.component';

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
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
    LoaderOverlayComponent
  ],
})
export class HomePage {

  @ViewChild('loader') loader?: LoaderOverlayComponent;

  iniciarCarga(){
    this.loader?.showfor(5000);
  }
}
