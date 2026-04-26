import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ParametresPage } from '../parametres/parametres.page';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';
import { firstValueFrom } from 'rxjs';
import { BadgeService } from '../shared/services/badge.service';

export interface Postulation {
  id_postulation?: number;
  project_id?: number;
  Nom:string;
  Prenom:string;
  Nomduprojet: string;
  Publierparentreprise: string;
  Budget?: number;
  Duree?: string;
  messagePostulation: string;
  statut: 'En attente' | 'Acceptée' | 'Refusée' | 'Terminée';
  date_postulation: string;
  entrepreneurEvalue?: boolean;
  id_entrepreneur?: number;
  expanded?: boolean;
}

@Component({
  selector: 'app-postulation',
  templateUrl: './postulation.page.html',
  styleUrls: ['./postulation.page.scss'],
  standalone: false,
})
export class PostulationPage implements OnInit {
  private apiUrl = environment.apiUrl;

  selectedTab = 'all';
  allPostulations: Postulation[] = [];
  displayedPostulations: Postulation[] = [];
  enCoursCount: number = 0;
  terminesCount: number = 0;
  messagesNonLus: number = 0;
  notificationsCount: number = 0;
  private badgeInterval: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController,
    private alertsService: AlertsService,
    private badgeService: BadgeService,
  ) {}
  ngOnInit() {
    this.loadPostulations();
    this.loadBadges();
    this.badgeInterval = setInterval(() => this.loadBadges(), 5000);
  }
  ionViewWillEnter() {
    this.loadPostulations();
  }

  async loadPostulations() {
  const id_developpeur = localStorage.getItem('userId');
  try {
    const postulations = await firstValueFrom(
      this.http.get<Postulation[]>(`${this.apiUrl}/candidature.php`, {
        params: { id_developpeur: id_developpeur! }
      })
    );
    this.allPostulations = postulations;
    this.filterPostulations();
  } catch(err) {}
}

  onTabChange() {
    this.filterPostulations();
  }

  filterPostulations() {
    switch (this.selectedTab) {
      case 'all':
        this.displayedPostulations = [...this.allPostulations];
        break;
      case 'pending':
        this.displayedPostulations = this.allPostulations.filter(
          (p) => p.statut === 'En attente',
        );
        break;
      case 'accepted':
        this.displayedPostulations = this.allPostulations.filter(
          (p) => p.statut === 'Acceptée',
        );
        break;
      case 'completed':
        this.displayedPostulations = this.allPostulations.filter(
          (p) => p.statut === 'Terminée',
        );
        break;
      case 'rejected':
        this.displayedPostulations = this.allPostulations.filter(
          (p) => p.statut === 'Refusée',
        );
        break;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'En attente':
        return 'warning';
      case 'Acceptée':
        return 'success';
      case 'Terminée':
        return 'tertiary';
      case 'Refusée':
        return 'danger';
      default:
        return 'medium';
    }
  }

  evaluerEntrepreneur(postulation: Postulation) {
    this.router.navigate(['/evaluation'], {
      state: {
        projet: postulation,
        entrepreneurId: postulation.id_entrepreneur,
        type: 'developpeur',
      },
    });
  }
  startProject(postulation: Postulation) {
    this.router.navigate(['/chat'], {
      queryParams: {
        projectId: postulation.project_id,
        userId: postulation.id_entrepreneur,
      },
    });
  }
 
async terminerProject(postulation: Postulation) {
  if (!postulation.id_postulation) return;
  try {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/candidature.php`, {}, {
        params: { id: postulation.id_postulation!, action: 'terminer' }
      })
    );
    this.alertsService.alert('Projet terminé !');
    this.loadPostulations();
  } catch(err) {}
}

async cancelProject(postulation: Postulation) {
  if (!postulation.id_postulation) return;
  try {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/candidature.php`, {
        params: { id: postulation.id_postulation! }
      })
    );
    this.loadPostulations();
  } catch(err) {}
}




  goToAccueil() {
    this.router.navigate(['/accueil-developpeur']);
  }
  async ouvrirParametre() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal',
    });
    return await modal.present();
  }
  ouvrirRecommended() {
    this.router.navigate(['/recommended']);
  }

  /*loadBadges() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');*/
   /* this.http
      .get<any>(`${this.apiUrl}/badge.php?userId=${userId}&role=${role}`)*/
     /* this.http.get<any>(`${this.apiUrl}/badge.php`, {
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
      case 'mes-postulation':
        break;
        case 'accueil':
        this.router.navigate(['/accueil-developpeur']);
        break;
      /*case 'mes-postulation':
        this.router.navigate(['/postulation']);
        break;*/
    /*  case 'profil':
        this.router.navigate(['/profile-dev']);
        break;*/
      case 'conversations':
        this.router.navigate(['/conversations']);
        break;

      case 'dashboard-dev':
        this.router.navigate(['/dashboard-dev']);
        break;
        /* case 'workshops':
        this.router.navigate(['/workshops']);
        break;*/
      case 'parametres':
        this.router.navigate(['/parametres']);

        break;


      case 'signout':
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.router.navigate(['/home']);
        break;
    }
  }
}
