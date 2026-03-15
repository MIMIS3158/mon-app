import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular'; 
import { ParametresPage } from '../parametres/parametres.page';

export interface Notification {
  id?: number;
  project_id?: number;
  Nomduprojet: string;
  Nomdev?: string;
  developpeur_id?: number;
  messagePostulation: string;
  Budget?: number;
  Duree?: string;
  statut: 'En attente' | 'Acceptée' | 'Terminée';
  date_postulation: string;
  developpeurEvalue?: boolean;
    developpeur_user_id?: number;
}


@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: false
})
export class NotificationPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';

  selectedTab = 'pending';
  notifications: Notification[] = [];
  displayedNotifications: Notification[] = [];


  constructor(
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController 
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  ionViewWillEnter() {
    this.loadNotifications();
  }

 /* loadNotifications() {
    this.http.get<Notification[]>(`${this.apiUrl}/get_candidatures_entrepreneur.php`)
      .subscribe({
        next: (candidatures) => {
          this.notifications = candidatures;
          this.filterNotifications();
        },
        error: () => {}
      });
  }*/
 loadNotifications() {
    const userId = localStorage.getItem('userId');
    this.http.get<Notification[]>(
        `${this.apiUrl}/get_candidatures_entrepreneur.php?userId=${userId}`)
        .subscribe({
            next: (candidatures) => {
                this.notifications = candidatures;
                this.filterNotifications();
            },
            error: () => {}
        });
}

  onTabChange() {
    this.filterNotifications();
  }

  filterNotifications() {
    switch(this.selectedTab) {
      case 'all':
        this.displayedNotifications = [...this.notifications];
        break;
      case 'pending':
        this.displayedNotifications = this.notifications.filter(n => n.statut === 'En attente');
        break;
      case 'accepted':
        this.displayedNotifications = this.notifications.filter(n => n.statut === 'Acceptée');
        break;
     /* case 'rejected':
        this.displayedNotifications = this.notifications.filter(n => n.statut === 'Refusée');
        break;*/
        case 'completed':
    this.displayedNotifications = this.notifications.filter(n => n.statut === 'Terminée');
    break;
    }
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'En attente':
        return 'warning';
      case 'Acceptée':
        return 'success';
      case 'Refusée':
        return 'danger';
      default:
        return 'medium';
    }
  }

  accepter(notif: Notification) {
    if (!notif.id) return;

  // this.http.put(`${this.apiUrl}/update_candidature.php?id=${notif.id}&action=accepter`, {})
      
    this.http.put(`${this.apiUrl}/candidature.php?id=${notif.id}&action=accepter`, {})
      
    .subscribe({
        next: () => {
          this.loadNotifications();
        },
        error: () => {}
      });
  }

  refuser(notif: Notification) {
    if (!notif.id) return;

    //this.http.put(`${this.apiUrl}/update_candidature.php?id=${notif.id}&action=refuser`, {})
    this.http.put(`${this.apiUrl}/candidature.php?id=${notif.id}&action=refuser`, {})
      .subscribe({
        next: () => {
          this.loadNotifications();
        },
        error: () => {}
      });
  }
/*
  contacterDeveloppeur(notif: Notification) {
    this.router.navigate(['/chat'], {
      queryParams: { 
        projectId: notif.project_id,
        userId: notif.developpeur_id
      }
    });
  }*/
 contacterDeveloppeur(notif: Notification) {
    this.router.navigate(['/chat'], {
        queryParams: { 
            projectId: notif.project_id,
            userId: notif.developpeur_user_id  // ⭐ user_id pas developpeur_id
        }
    });
}
  evaluerDeveloppeur(notif: Notification) {
    this.router.navigate(['/evaluation'], {
        state: {
            projet: {
                id: notif.project_id,
                Nomduprojet: notif.Nomduprojet,
                Publierparentreprise: notif.Nomdev
            },
            type: 'entrepreneur',
            developpeurId: notif.developpeur_id
        }
    });
}
async ouvrirParametre() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal'
    });
    return await modal.present();
  }
  goTo(tab: string) {
    switch(tab) {
      case 'notification':
        break;
      case 'accueil':
        this.router.navigate(['/accueil-entrepreneur']);
        break;
      case 'profil':
        this.router.navigate(['/profile-entrepreneur']);
        break;
      case 'conversations':
        this.router.navigate(['/conversations']);
        break;
      case 'parametres':
        this.router.navigate(['/parametres']);
        break;
    }
  }
}