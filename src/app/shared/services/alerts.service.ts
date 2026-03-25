import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async alert(message: string, header = '', cssClass = 'my-custom-alert') {
    const alert = await this.alertCtrl.create({
      message,
      header,
      cssClass,
      buttons: [
        {
          text: 'OK',
          cssClass: 'alert-button-confirm',
          handler: () => {}
        }
      ]
    });

    await alert.present();
  }

  async toast(message: string, cssClass = 'my-custom-toast') {
    const toast = await this.toastCtrl.create({
      message,
      cssClass,
      duration: 1000
    });
    await toast.present();
  }
}
