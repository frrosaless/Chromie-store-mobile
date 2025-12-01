import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
  IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ApiService, Categoria } from 'src/app/services/apiservice';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonBackButton, IonButtons, RouterModule, IonList, IonItem, IonLabel
  ],
})
export class CategoriasPage implements OnInit {
  // Creamos un array para almacenar las categorías
  categorias: Categoria[] = [];

  // Inyectamos el servicio de la API
  private apiService = inject(ApiService);

  ngOnInit() {
    // En ngOnInit, llamamos al método para obtener las categorías
    this.apiService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error("Error al cargar las categorías:", err)
    });
  }
}
