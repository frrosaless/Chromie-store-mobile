import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import * as L from 'leaflet'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mapa-modal',
  templateUrl: './mapa-modal.page.html',
  styleUrls: ['./mapa-modal.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, FormsModule, IonButtons, IonButton, IonIcon, HttpClientModule]
})
export class MapaModalPage implements AfterViewInit {
  private modalCtrl = inject(ModalController);
  private http = inject(HttpClient);
  private map: L.Map | any;
  private marker: L.Marker | any;
  private selectedAddress: any = null;

  constructor() { }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    // Coordenadas iniciales (Punta Arenas, Chile)
    this.map = L.map('map', {
      center: [-53.1638, -70.9171],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      // Imprimimos el evento completo en la consola para depuración
      console.log('Evento de click en el mapa:', e);

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Añadir o mover marcador
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      // Obtener dirección (geocodificación inversa)
      this.getAddress(lat, lng);
    });
  }


  private getAddress(lat: number, lng: number) {
    // Usamos el proxy configurado en angular.json y proxy.conf.json
    const url = `/nominatim/reverse?format=json&lat=${lat}&lon=${lng}`;

    // El User-Agent ahora se configura en el proxy (proxy.conf.json) para evitar errores de "unsafe header".
    this.http.get<any>(url).subscribe({
      next: (data) => {
        // Imprimimos la respuesta completa de la API para ver qué nos llega
        console.log('Respuesta de Nominatim:', data);

        // Verificamos si tenemos una respuesta válida con al menos un display_name
        if (data && data.display_name) {
          // Construimos una dirección más corta en lugar de usar el display_name completo
          const addressParts = [];
          if (data.address?.road) {
            addressParts.push(data.address.road);
          }
          if (data.address?.house_number) {
            addressParts.push(data.address.house_number);
          }

          this.selectedAddress = {
            // Unimos las partes de la dirección. Si no hay, usamos el display_name como respaldo.
            address: addressParts.length > 0 ? addressParts.join(' ') : data.display_name,
            comuna: data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || '',
            region: data.address?.state || data.address?.county || ''
          };
          // Mostramos el popup en el marcador con la dirección obtenida
          this.marker.bindPopup(`<b>Dirección:</b><br>${this.selectedAddress.address}`).openPopup();
        }

    },
      error: (err) => {
        console.error('Error al obtener la dirección desde Nominatim:', err);
      }
    });
  }

  cancel() {

    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.selectedAddress) {
      return this.modalCtrl.dismiss(this.selectedAddress, 'confirm');
    }
    // Opcional: mostrar alerta si no se ha seleccionado dirección
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}