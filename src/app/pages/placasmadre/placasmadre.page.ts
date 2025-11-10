import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons} from '@ionic/angular/standalone';

@Component({
  selector: 'app-placasmadre',
  templateUrl: './placasmadre.page.html',
  styleUrls: ['./placasmadre.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButtons]
})
export class PlacasmadrePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
