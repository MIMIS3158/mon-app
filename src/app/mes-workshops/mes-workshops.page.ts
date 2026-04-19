import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mes-workshops',
  templateUrl: './mes-workshops.page.html',
  styleUrls: ['./mes-workshops.page.scss'],
  standalone: false,
})
export class MesWorkshopsPage implements OnInit {
  private apiUrl = environment.apiUrl;
  workshops: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() { this.loadWorkshops(); }
  ionViewWillEnter() { this.loadWorkshops(); }

  /*async loadWorkshops() {
    this.loading = true;
    const userId = localStorage.getItem('userId');
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/workshops.php`, {
          params: { userId: userId!, page: '1', limit: '50' }
        })
      );
      this.workshops = res.workshops || [];
    } catch (err) {
      this.showToast('Erreur de chargement', 'danger');
    } finally {
      this.loading = false;
    }
  }*/
 async loadWorkshops() {
  this.loading = true;
  const userId = localStorage.getItem('userId');
  try {
    const res: any = await firstValueFrom(
      this.http.get(`${this.apiUrl}/workshops.php`, {
        params: { userId: userId!, page: '1', limit: '50' }
      })
    );
    this.workshops = (res.workshops || []).map((w: any) => ({
      ...w,
      thumbnail: w.thumbnail && !w.thumbnail.startsWith('http') && !w.thumbnail.startsWith('assets')
        ? `http://localhost:8000/${w.thumbnail}`
        : w.thumbnail
    }));
  } catch (err) {
    this.showToast('Erreur de chargement', 'danger');
  } finally {
    this.loading = false;
  }
}

  getCountFree()     { return this.workshops.filter(w => w.is_free).length; }
  getCountPremium()  { return this.workshops.filter(w => !w.is_free).length; }
  getTotalParticipants() { return this.workshops.reduce((s, w) => s + (w.participants || 0), 0); }
  getProgress(w: any) {
    if (!w.max_participants) return 0;
    return Math.round((w.participants / w.max_participants) * 100);
  }

  editWorkshop(w: any) {
    this.router.navigate(['/publish-workshop'], { queryParams: { id: w.id } });
  }

  async deleteWorkshop(w: any) {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer',
      message: `Voulez-vous supprimer "${w.title}" ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer', role: 'destructive',
          handler: () => {
            this.http.delete(`${this.apiUrl}/workshops.php`, {
              params: { id: w.id }
            }).subscribe({
              next: () => {
                this.workshops = this.workshops.filter(x => x.id !== w.id);
                this.showToast('Workshop supprimé', 'success');
              },
              error: () => this.showToast('Erreur suppression', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }
}