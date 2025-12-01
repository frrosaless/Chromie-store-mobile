import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, 
  IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonButton 
} from '@ionic/angular/standalone';
import { ApiService, Producto } from 'src/app/services/apiservice';
import { firstValueFrom, map } from 'rxjs';
import { HomePage } from 'src/app/home/home.page';

@Component({
  selector: 'app-productos-por-categoria',
  templateUrl: './productos-por-categoria.page.html',
  styleUrls: ['./productos-por-categoria.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonButton,
    HomePage // Importamos HomePage para poder usar su método agregarProducto
  ],
  providers: [HomePage] // Proveemos HomePage para poder inyectarla
})
export class ProductosPorCategoriaPage implements OnInit {
  productos: Producto[] = [];
  nombreCategoria: string = 'Categoría';
  
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  public homePage = inject(HomePage); // Inyectamos HomePage

  constructor() { }

  ngOnInit() {
    // Usamos firstValueFrom para obtener el valor del parámetro una vez
    firstValueFrom(this.route.paramMap).then(params => {
      const categoriaId = params.get('id');
      if (categoriaId) {
        this.cargarProductosPorCategoria(+categoriaId);
      }
    });
  }

  cargarProductosPorCategoria(categoriaId: number) {
    this.apiService.getProductos().pipe(
      // Filtramos los productos que coinciden con el categoria_id
      map(productos => productos.filter(p => p.categoria_id === categoriaId))
    ).subscribe(productosFiltrados => {
      this.productos = productosFiltrados;
      // Opcional: Si quieres mostrar el nombre de la categoría, necesitarías obtenerlo
      // Por ahora, lo dejamos como un título genérico o podrías buscarlo en otra llamada.
    });
  }
}