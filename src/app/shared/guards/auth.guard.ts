import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isConnected = localStorage.getItem('connected');

    if (isConnected === 'true') {
      return true;
    }

    // not connected → redirect
    this.router.navigateByUrl('/signin', { replaceUrl: true });
    return false;
  }
}
