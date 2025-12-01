import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
  IonButton, IonFooter, IonList, IonItem, IonLabel, IonThumbnail, IonImg, IonNote,
  IonIcon, ToastController
} from '@ionic/angular/standalone';
import { ApiService, ItemCarrito, Producto } from 'src/app/services/apiservice';
import { AuthService } from '../perfil/auth.service';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';

// Interfaz para combinar la información del item del carrito y el producto
export interface ItemCarritoDetallado extends ItemCarrito {
  producto: Producto;
  username: string; // <-- Añadir esta línea
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,
    CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonCardSubtitle, IonButton, IonFooter, IonList, IonItem, IonIcon,
    IonLabel, IonThumbnail, IonImg, CurrencyPipe, IonNote
  ],
})
export class CarritoPage implements OnInit {
  items: ItemCarritoDetallado[] = [];
  totalCarrito: number = 0;

  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({
      addCircleOutline,
      removeCircleOutline
    });
  }

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    const userData = this.authService.getUserData();
    if (!userData || !userData.username) {
      console.error("Usuario no autenticado.");
      // Opcional: mostrar un mensaje al usuario
      return;
    }

    // 1. Usamos forkJoin para obtener el carrito y la lista completa de productos en paralelo.
    forkJoin({
      itemsCarrito: this.apiService.getCarrito(userData.username),
      productos: this.apiService.getProductos()
    }).pipe(
      // 2. Una vez que tenemos ambas listas, las combinamos.
      map(({ itemsCarrito, productos }) => {
        // Si el carrito está vacío, retornamos un array vacío.
        if (!itemsCarrito || itemsCarrito.length === 0) {
          return [];
        }

        // Creamos un mapa de productos para una búsqueda rápida (id -> producto).
        const productosMap = new Map(productos.map(p => [p.id, p]));

        // Mapeamos los items del carrito para añadirles los detalles del producto.
        return itemsCarrito.map(item => {
          const producto = productosMap.get(item.producto_id);
          return {
            ...item,
            username: userData.username, // Añadimos el username para futuras acciones.
            producto: producto! // El '!' indica que estamos seguros que el producto existe.
          };
        }).filter(item => item.producto); // Filtramos por si algún producto no se encontró.
      })
    ).subscribe({
      next: (itemsDetallados) => {
        this.items = itemsDetallados;
        this.calcularTotal();
      },
      error: (err) => console.error("Error al cargar el carrito detallado:", err)
    });
  }

  calcularTotal() {
    this.totalCarrito = this.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }

  aumentarCantidad(item: ItemCarritoDetallado) {
    const nuevaCantidad = item.cantidad + 1;
    this.apiService.actualizarCantidad(item.username, item.producto_id, nuevaCantidad).subscribe({
      next: () => {
        // Creamos un nuevo array con el item actualizado para que Angular detecte el cambio
        this.items = this.items.map(i => {
          if (i.producto_id === item.producto_id) {
            return { ...i, cantidad: nuevaCantidad }; // Crea una copia del item con la nueva cantidad
          }
          return i; // Devuelve el item sin cambios
        });
        this.calcularTotal();
      },
      error: async (err) => {
        // Imprimimos el error completo para diagnóstico
        console.error("Error completo de la API:", err);
        // El detalle del error 422 de FastAPI suele estar en err.error
        console.error("Detalle del error (cuerpo de la respuesta):", JSON.stringify(err.error, null, 2));

        const toast = await this.toastCtrl.create({
          message: 'No se pudo actualizar la cantidad.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  disminuirCantidad(item: ItemCarritoDetallado) {
    const nuevaCantidad = item.cantidad - 1;

    if (nuevaCantidad <= 0) {
      // Si la cantidad es 0 o menos, eliminamos el item del carrito
      this.eliminarItem(item);
    } else {
      this.apiService.actualizarCantidad(item.username, item.producto_id, nuevaCantidad).subscribe({
        next: () => {
          // Mismo patrón inmutable que en aumentarCantidad
          this.items = this.items.map(i => {
            if (i.producto_id === item.producto_id) {
              return { ...i, cantidad: nuevaCantidad };
            }
            return i;
          });
          this.calcularTotal();
        },
        error: async (err) => {
          // Hacemos lo mismo para el método de disminuir
          console.error("Error completo de la API al disminuir:", err);
          console.error("Detalle del error (cuerpo de la respuesta):", JSON.stringify(err.error, null, 2));
        }
      });
    }
  }

  async eliminarItem(itemParaEliminar: ItemCarritoDetallado) {
    // Validamos que tengamos la información necesaria para llamar al endpoint /carrito/{username}/{producto_id}
    if (!itemParaEliminar || !itemParaEliminar.username || itemParaEliminar.producto_id === undefined) {
      console.error("Datos incompletos para eliminar el item.");
      return;
    }

    // Llamamos al servicio con los parámetros que espera tu API de FastAPI
    this.apiService.eliminarDelCarrito(itemParaEliminar.username, itemParaEliminar.producto_id).subscribe({
      next: async () => {
        // Eliminación exitosa, actualizamos la UI
        // Filtramos el item eliminado de la lista local para que la vista se actualice
        this.items = this.items.filter(item => item.producto_id !== itemParaEliminar.producto_id);
        this.calcularTotal();

        const toast = await this.toastCtrl.create({
          message: 'Producto eliminado del carrito.',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      },
      error: async (err) => {
        console.error("Error al eliminar el producto:", err);
        const toast = await this.toastCtrl.create({
          message: 'Error al eliminar el producto.',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
