import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const whoIs = localStorage.getItem('is');

    if (whoIs === 'dev') {
      this.router.navigate(['/accueil-developpeur']);
      return false;
    }

    if (whoIs === 'business') {
      this.router.navigate(['/accueil-entrepreneur']);
      return false;
    }

    return true;
  }
}
