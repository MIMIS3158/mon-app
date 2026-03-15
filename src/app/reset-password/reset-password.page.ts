/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false
})
export class ResetPasswordPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}*
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false // ⭐ Ajouter cette ligne
})
export class ResetPasswordPage {
  email: string = '';
  private apiUrl = 'http://localhost/myApp/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {}

  envoyerCode() {
    if (!this.email || !this.validateEmail(this.email)) {
      this.presentToast('Veuillez entrer un email valide', 'warning');
      return;
    }

    this.http.post(`${this.apiUrl}/send_reset_code.php`, { email: this.email })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.presentToast('Code envoyé à votre email !', 'success');
            this.router.navigate(['/verify-code'], { 
              queryParams: { email: this.email } 
            });
          } else {
            this.presentToast(response.message || 'Email introuvable', 'danger');
          }
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.presentToast('Erreur lors de l\'envoi', 'danger');
        }
      });
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false // ⭐ Ajouter cette ligne
})
export class ResetPasswordPage {

  password = '';
  confirmPassword = '';
  email = localStorage.getItem('resetEmail');

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {

    if (this.password !== this.confirmPassword) return;

    this.http.post('http://localhost/api/reset-password.php', {
      email: this.email,
      password: this.password
    }).subscribe(() => {

      alert("Mot de passe modifié ✅");
      this.router.navigate(['/login']);

    });
  }
}
*/
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false
})
export class ResetPasswordPage {
  email: string = '';
  private apiUrl = 'http://localhost/myApp/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {}

  // Envoyer le code de réinitialisation
  envoyerCode() {
    if (!this.email || !this.validateEmail(this.email)) {
      this.presentToast('Veuillez entrer un email valide', 'warning');
      return;
    }

    this.http.post(`${this.apiUrl}/send_reset_code.php`, { email: this.email })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.presentToast('Code envoyé ! Vérifiez votre email', 'success');
            // Rediriger vers la page de vérification du code
            this.router.navigate(['/verify-code'], { 
              queryParams: { email: this.email } 
            });
          } else {
            this.presentToast(response.message || 'Email introuvable', 'danger');
          }
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.presentToast('Erreur lors de l\'envoi', 'danger');
        }
      });
  }

  // Validation email
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}