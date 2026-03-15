/*import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  private apiUrl = 'http://localhost/myApp/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Récupérer l'email et le token
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      
      if (!this.email || !this.token) {
        this.router.navigate(['/reset-password']);
      }
    });
  }

  changerMotDePasse() {
    // Validation
    if (!this.newPassword || !this.confirmPassword) {
      this.presentToast('Veuillez remplir tous les champs', 'warning');
      return;
    }

    if (this.newPassword.length < 6) {
      this.presentToast('Le mot de passe doit contenir au moins 6 caractères', 'warning');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('Les mots de passe ne correspondent pas', 'danger');
      return;
    }

    // Envoyer au backend
    this.http.post(`${this.apiUrl}/update_password.php`, {
      email: this.email,
      token: this.token,
      new_password: this.newPassword
    }).subscribe({
      next: async (response: any) => {
        if (response.success) {
          const alert = await this.alertController.create({
            header: 'Succès !',
            message: 'Votre mot de passe a été réinitialisé avec succès',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigate(['/home']);
              }
            }]
          });
          await alert.present();
        } else {
          this.presentToast(response.message || 'Erreur lors de la réinitialisation', 'danger');
        }
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.presentToast('Erreur lors de la réinitialisation', 'danger');
      }
    });
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
}*/
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
  standalone: false // ⭐ Important
})
export class NewPasswordPage implements OnInit {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  private apiUrl = 'http://localhost/myApp/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      
      if (!this.email || !this.token) {
        this.router.navigate(['/reset-password']);
      }
    });
  }

  changerMotDePasse() {
    if (!this.newPassword || !this.confirmPassword) {
      this.presentToast('Veuillez remplir tous les champs', 'warning');
      return;
    }

    if (this.newPassword.length < 6) {
      this.presentToast('Le mot de passe doit contenir au moins 6 caractères', 'warning');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('Les mots de passe ne correspondent pas', 'danger');
      return;
    }

    this.http.post(`${this.apiUrl}/update_password.php`, {
      email: this.email,
      token: this.token,
      new_password: this.newPassword
    }).subscribe({
      next: async (response: any) => {
        if (response.success) {
          const alert = await this.alertController.create({
            header: 'Succès !',
            message: 'Votre mot de passe a été réinitialisé avec succès',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigate(['/home']);
              }
            }]
          });
          await alert.present();
        } else {
          this.presentToast(response.message || 'Erreur lors de la réinitialisation', 'danger');
        }
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.presentToast('Erreur lors de la réinitialisation', 'danger');
      }
    });
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