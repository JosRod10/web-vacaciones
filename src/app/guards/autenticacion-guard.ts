import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginServices } from '../servicios/login';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: LoginServices, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Permite el acceso
    } else {
      this.router.navigate(['/login']); // Redirige al login
      return false;
    }
  }
}
