import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './pages/perfil/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userData = authService.getUserData();

  if (userData) {
    // Si hay datos de usuario, significa que está autenticado. Permitir acceso.
    return true;
  } else {
    // Si no hay datos, redirigir a la página de login y bloquear el acceso.
    router.navigate(['/login']);
    return false;
  }
};
