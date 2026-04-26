/*import { Component, Input } from '@angular/core';
//import { ModalController } from '@ionic/angular';
import { AlertsService } from '../../shared/services/alerts.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  standalone: false,
})
export class ContactInfoComponent {
  @Input() name: string = '';
  @Input() photo: string = '';
  @Input() userId: number = 0;

  constructor(
    private modalController: ModalController,
    private alertsService: AlertsService,
    private router: Router,
    private http: HttpClient,
    private alertCtrl: AlertController 
  ) {}
  private apiUrl = environment.apiUrl;
  isBlocked: boolean = false;
  ngOnInit() {
  this.checkIfBlocked();
}

  close() {
    this.modalController.dismiss();
  }

  voirProfil() {
    this.modalController.dismiss();
    this.router.navigate(['/profile-dev'], {
      queryParams: { view: 'summary', user_id: this.userId }
    });
  }
  checkIfBlocked() {
  const currentUserId = localStorage.getItem('userId');
  this.http.get<any>(`${this.apiUrl}/block_user.php`, {
    params: { blocker_id: currentUserId!, blocked_id: this.userId }
  }).subscribe({
    next: (data) => {
      this.isBlocked = data.blocked;
    },
    error: () => {}
  });
}
async bloquer() {
  const action = this.isBlocked ? 'débloquer' : 'bloquer';
  const confirmed = await this.alertsService.confirm(
    `Voulez-vous ${action} ${this.name} ?`,
    this.isBlocked ? 'Débloquer' : 'Bloquer'
  );
  if (!confirmed) return;

  const currentUserId = localStorage.getItem('userId');

  if (this.isBlocked) {
    this.http.delete(`${this.apiUrl}/block_user.php`, {
      params: { blocker_id: currentUserId!, blocked_id: this.userId }
    }).subscribe({
      next: () => {
        this.isBlocked = false;
        this.alertsService.toast(`${this.name} a été débloqué`);
      },
      error: () => {
        this.alertsService.alert('Erreur lors du déblocage');
      }
    });
  } else {
    this.http.post(`${this.apiUrl}/block_user.php`, {
      blocker_id: currentUserId,
      blocked_id: this.userId
    }).subscribe({
      next: () => {
        this.isBlocked = true;
        this.alertsService.toast(`${this.name} a été bloqué`);
        this.modalController.dismiss({ blocked: true });
      },
      error: () => {
        this.alertsService.alert('Erreur lors du blocage');
      }
    });
  }
}
  
 async signaler() {
  const alert = await this.alertsService.confirmWithInputs(
    '🚩 Signaler ' + this.name,
    [
      {
        name: 'raison',
        type: 'text',
        placeholder: 'Raison du signalement'
      },
      {
        name: 'description',
        type: 'textarea',
        placeholder: 'Décrivez le problème...'
      }
    ]
  );
}
 async supprimerDiscussion() {
  const confirmed = await this.alertsService.confirm(
    'Voulez-vous supprimer cette discussion ?',
    'Supprimer'
  );
  if (!confirmed) return;

  const currentUserId = localStorage.getItem('userId');
  
  this.http.delete(`${this.apiUrl}/delete_conversation.php`, {
    params: { user_id: currentUserId!, contact_id: this.userId }
  }).subscribe({
    next: () => {
      this.alertsService.toast('Discussion supprimée');
      this.modalController.dismiss({ deleted: true });
    },
    error: () => {
      this.alertsService.alert('Erreur lors de la suppression');
    }
  });
}
  
}*/
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AlertsService } from '../../shared/services/alerts.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  standalone: false,
})
export class ContactInfoComponent implements OnInit {
  @Input() name: string = '';
  @Input() photo: string = '';
  @Input() userId: number = 0;

  private apiUrl = environment.apiUrl;
  isBlocked: boolean = false;

  constructor(
    private modalController: ModalController,
    private alertsService: AlertsService,
    private router: Router,
    private http: HttpClient,
    private alertCtrl: AlertController // ← ajoute ça
  ) {}

  ngOnInit() {
    this.checkIfBlocked();
  }

  close() {
    this.modalController.dismiss();
  }

  voirProfil() {
    this.modalController.dismiss();
    this.router.navigate(['/profile-dev'], {
      queryParams: { view: 'summary', user_id: this.userId }
    });
  }

  checkIfBlocked() {
    const currentUserId = localStorage.getItem('userId');
    this.http.get<any>(`${this.apiUrl}/block_user.php`, {
      params: { blocker_id: currentUserId!, blocked_id: this.userId }
    }).subscribe({
      next: (data) => { this.isBlocked = data.blocked; },
      error: () => {}
    });
  }

  async bloquer() {
    const action = this.isBlocked ? 'débloquer' : 'bloquer';
    const confirmed = await this.alertsService.confirm(
      `Voulez-vous ${action} ${this.name} ?`,
      this.isBlocked ? 'Débloquer' : 'Bloquer'
    );
    if (!confirmed) return;

    const currentUserId = localStorage.getItem('userId');

    if (this.isBlocked) {
      this.http.delete(`${this.apiUrl}/block_user.php`, {
        params: { blocker_id: currentUserId!, blocked_id: this.userId }
      }).subscribe({
        next: () => {
          this.isBlocked = false;
          this.alertsService.toast(`${this.name} a été débloqué`);
        },
        error: () => {
          this.alertsService.alert('Erreur lors du déblocage');
        }
      });
    } else {
      this.http.post(`${this.apiUrl}/block_user.php`, {
        blocker_id: currentUserId,
        blocked_id: this.userId
      }).subscribe({
        next: () => {
          this.isBlocked = true;
          this.alertsService.toast(`${this.name} a été bloqué`);
          this.modalController.dismiss({ blocked: true });
        },
        error: () => {
          this.alertsService.alert('Erreur lors du blocage');
        }
      });
    }
  }

  // ── SIGNALER ──────────────────────────────
  async signaler() {
    const alert = await this.alertCtrl.create({
      header: '🚩 Signaler ' + this.name,
      inputs: [
        {
          name: 'raison',
          type: 'text',
          placeholder: 'Raison du signalement'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Décrivez le problème...'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
       /* {
          text: 'Envoyer',
          handler: (data) => {
            if (!data.raison) {
              this.alertsService.alert('Veuillez indiquer une raison');
              return false;
            }
            const currentUserId = localStorage.getItem('userId');
            this.http.post(`${this.apiUrl}/report.php`, {
              reporter_id: currentUserId,
              reported_id: this.userId,
              raison: data.raison,
              description: data.description || ''
            }).subscribe({
              next: () => {
                this.alertsService.toast('Signalement envoyé ✅');
                this.modalController.dismiss();
              },
              error: () => {
                this.alertsService.alert('Erreur lors du signalement');
              }
            });
             return true;
          }
        }*/
        {
  text: 'Envoyer',
  handler: (data): boolean => {
    if (!data.raison) {
      this.alertsService.alert('Veuillez indiquer une raison');
      return false;
    }
    const currentUserId = localStorage.getItem('userId');
    this.http.post(`${this.apiUrl}/report.php`, {
      reporter_id: currentUserId,
      reported_id: this.userId,
      raison: data.raison,
      description: data.description || ''
    }).subscribe({
      next: () => {
        this.alertsService.toast('Signalement envoyé ✅');
        this.modalController.dismiss();
      },
      error: () => {
        this.alertsService.alert('Erreur lors du signalement');
      }
    });
    return true; // ← ajoute cette ligne
  }
}
      ]
    });
    await alert.present();
  }

  async supprimerDiscussion() {
    const confirmed = await this.alertsService.confirm(
      'Voulez-vous supprimer cette discussion ?',
      'Supprimer'
    );
    if (!confirmed) return;

    const currentUserId = localStorage.getItem('userId');

    this.http.delete(`${this.apiUrl}/delete_conversation.php`, {
      params: { user_id: currentUserId!, contact_id: this.userId }
    }).subscribe({
      next: () => {
        this.alertsService.toast('Discussion supprimée');
        this.modalController.dismiss({ deleted: true });
      },
      error: () => {
        this.alertsService.alert('Erreur lors de la suppression');
      }
    });
  }
}