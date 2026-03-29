import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ParametresPage } from '../parametres/parametres.page';
import { environment } from 'src/environments/environment';
import { BadgeService } from '../shared/services/badge.service';

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
  standalone: false,
})
export class NotificationPage implements OnInit {
  private apiUrl = environment.apiUrl;

  selectedTab = 'pending';
  notifications: Notification[] = [];
  displayedNotifications: Notification[] = [];
  enCoursCount: number = 0;
  terminesCount: number = 0;
  messagesNonLus: number = 0;
  notificationsCount: number = 0;
  private badgeInterval: any;
  
pageTitle: string = 'Candidatures reçues';
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private badgeService: BadgeService,
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['statut'] === 'terminé') {
        this.selectedTab = 'completed';
      }
      this.loadNotifications();
    });
    this.loadBadges();
    this.badgeInterval = setInterval(() => this.loadBadges(), 5000);
  }
  ionViewWillEnter() {
    this.loadNotifications();
    this.loadBadges();
  }
  async loadNotifications() {
  const userId = localStorage.getItem('userId');
  try {
    const candidatures = await firstValueFrom(
      this.http.get<Notification[]>(`${this.apiUrl}/get_candidatures_entrepreneur.php`, {
        params: { userId: userId! }
      })
    );
    this.notifications = candidatures;
    this.filterNotifications();
  } catch(err) {}
}
  
  onTabChange() {
    this.filterNotifications();
  }
  /*filterNotifications() {
    switch (this.selectedTab) {
      case 'all':
        this.displayedNotifications = [...this.notifications];
        break;
      case 'pending':
        this.displayedNotifications = this.notifications.filter(
          (n) => n.statut === 'En attente',
        );
        break;
      case 'accepted':
        this.displayedNotifications = this.notifications.filter(
          (n) => n.statut === 'Acceptée',
        );
        break;
      case 'completed':
        this.displayedNotifications = this.notifications.filter(
          (n) => n.statut === 'Terminée',
        );
        break;
    }
  }*/

filterNotifications() {
  switch (this.selectedTab) {
    case 'all':
      this.displayedNotifications = [...this.notifications];
      this.pageTitle = 'Toutes les candidatures';
      break;
    case 'pending':
      this.displayedNotifications = this.notifications.filter(n => n.statut === 'En attente');
      this.pageTitle = 'Candidatures reçues';
      break;
    case 'accepted':
      this.displayedNotifications = this.notifications.filter(n => n.statut === 'Acceptée');
      this.pageTitle = 'Candidatures acceptées';
      break;
    case 'completed':
      this.displayedNotifications = this.notifications.filter(n => n.statut === 'Terminée');
      this.pageTitle = 'Projets terminés'; 
      break;
  }
}
  getStatusColor(status: string): string {
    switch (status) {
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
  
  async accepter(notif: Notification) {
  if (!notif.id) return;
  try {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/candidature.php`, {}, {
        params: { id: notif.id!, action: 'accepter' }
      })
    );
    this.loadNotifications();
  } catch(err) {}
}

  async refuser(notif: Notification) {
  if (!notif.id) return;
  try {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/candidature.php`, {}, {
        params: { id: notif.id!, action: 'refuser' }
      })
    );
    this.loadNotifications();
  } catch(err) {}
}
  contacterDeveloppeur(notif: Notification) {
    this.router.navigate(['/chat'], {
      queryParams: {
        projectId: notif.project_id,
        userId: notif.developpeur_user_id,
      },
    });
  }
  evaluerDeveloppeur(notif: Notification) {
    this.router.navigate(['/evaluation'], {
      state: {
        projet: {
          id: notif.project_id,
          Nomduprojet: notif.Nomduprojet,
          Publierparentreprise: notif.Nomdev,
        },
        type: 'entrepreneur',
        developpeurId: notif.developpeur_id,
      },
    });
  }
  async ouvrirParametre() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal',
    });
    return await modal.present();
  }

  /*loadBadges() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');*/
  /*  this.http
      .get<any>(`${this.apiUrl}/badge.php?userId=${userId}&role=${role}`)*/
      /*this.http.get<any>(`${this.apiUrl}/badge.php`, {
  params: { userId: userId!, role: role! }
})
      .subscribe({
        next: (data) => {
          this.messagesNonLus = data.messages;
          this.notificationsCount = data.notifications;
          this.enCoursCount = data.en_cours;
          this.terminesCount = data.termines;
        },
        error: () => {},
      });
  }*/

loadBadges() {
  this.badgeService.getBadges().subscribe({
    next: (data) => {
      this.messagesNonLus = data.messages;
      this.notificationsCount = data.notifications;
      this.enCoursCount = data.en_cours;
      this.terminesCount = data.termines;
    },
    error: () => {},
  });
}




  ionViewWillLeave() {
    if (this.badgeInterval) clearInterval(this.badgeInterval);
  }
  goTo(tab: string) {
    switch (tab) {
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
      case 'dashboard':
        this.router.navigate(['/dashboard-entrepreneur']);
        break;
      case 'parametres':
        this.router.navigate(['/parametres']);
        break;
    }
  }
}
