import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage),
    canActivate: [authGuard]
  },
  {
    path: 'categorias',
    loadComponent: () => import('./pages/categorias/categorias.page').then( m => m.CategoriasPage),
    canActivate: [authGuard]
  },
  {
    path: 'procesadores',
    loadComponent: () => import('./pages/procesadores/procesadores.page').then( m => m.ProcesadoresPage),
    canActivate: [authGuard]
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito.page').then( m => m.CarritoPage),
    canActivate: [authGuard]
  },
  {
    path: 'placasmadre',
    loadComponent: () => import('./pages/placasmadre/placasmadre.page').then( m => m.PlacasmadrePage),
    canActivate: [authGuard]
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'productos-por-categoria/:id', // El ':id' es un parámetro dinámico
    loadComponent: () => import('./pages/categorias/productos-por-categoria.page').then( m => m.ProductosPorCategoriaPage),
    canActivate: [authGuard]
  },
  {
    path: 'mapa-modal',
    loadComponent: () => import('./pages/mapa-modal/mapa-modal.page').then( m => m.MapaModalPage)
  },
];
