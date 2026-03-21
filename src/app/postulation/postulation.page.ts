import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular'; 
import { ParametresPage } from '../parametres/parametres.page';


export interface Postulation {
  id_postulation?: number; 
  project_id?: number;
  Nomduprojet: string;
  Publierparentreprise: string;
  Budget?: number;
  Duree?: string;
  messagePostulation: string;
  statut: 'En attente' | 'Acceptée' | 'Refusée' | 'Terminée'; 
  date_postulation: string;
  entrepreneurEvalue?: boolean; 
  id_entrepreneur?: number; 
}

@Component({
  selector: 'app-postulation',
  templateUrl: './postulation.page.html',
  styleUrls: ['./postulation.page.scss'],
  standalone: false
})
export class PostulationPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';

  selectedTab = 'all';
  allPostulations: Postulation[] = [];
  displayedPostulations: Postulation[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController 
  ) {}
  ngOnInit() {
    this.loadPostulations();
  }
  ionViewWillEnter() {
    this.loadPostulations();
  }
loadPostulations() {
    const id_developpeur = localStorage.getItem('userId'); 
    this.http.get<Postulation[]>(
        `${this.apiUrl}/candidature.php?id_developpeur=${id_developpeur}`)
        .subscribe({
            next: (postulations) => {
                this.allPostulations = postulations;
                this.filterPostulations();
            },
            error: () => {}
        });
}

  onTabChange() {
    this.filterPostulations();
  }

 filterPostulations() {
  switch(this.selectedTab) {
    case 'all':
      this.displayedPostulations = [...this.allPostulations];
      break;
    case 'pending':
      this.displayedPostulations = this.allPostulations.filter(p => p.statut === 'En attente');
      break;
    case 'accepted':
      this.displayedPostulations = this.allPostulations.filter(p => p.statut === 'Acceptée');
      break;
    case 'completed': 
      this.displayedPostulations = this.allPostulations.filter(p => p.statut === 'Terminée');
      break;
    case 'rejected':
      this.displayedPostulations = this.allPostulations.filter(p => p.statut === 'Refusée');
      break;
  }
}

getStatusColor(status: string): string {
  switch(status) {
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
      type: 'developpeur' 
    }
  });
}
 startProject(postulation: Postulation) {
  this.router.navigate(['/chat'], {
    queryParams: { 
      projectId: postulation.project_id,
      userId: postulation.id_entrepreneur   
    }
  });
}
terminerProject(postulation: Postulation) {
    if (!postulation.id_postulation) return;
    
    this.http.put(
        `${this.apiUrl}/candidature.php?id=${postulation.id_postulation}&action=terminer`, {})
        .subscribe({
            next: () => {
                alert('Projet terminé !');
                this.loadPostulations();
            },
            error: () => {}
        });
}
cancelProject(postulation: Postulation) {
    if (!postulation.id_postulation) return;
    this.http.delete(
        `${this.apiUrl}/candidature.php?id=${postulation.id_postulation}`)
        .subscribe({
            next: () => { this.loadPostulations(); },
            error: () => {}
        });
}
  goToAccueil() {
    this.router.navigate(['/accueil-developpeur']);
  }
 async ouvrirParametre() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal'
    });
    return await modal.present();
  }
  ouvrirRecommended() {
  this.router.navigate(['/recommended']);
}
  goTo(tab: string) {
    switch(tab) {
      /*case 'accueil':
        break;
      case 'mes-postulation':
        this.router.navigate(['/postulation']);
        break;*/
        case 'mes-postulation':
          break;
      case 'accueil':
        this.router.navigate(['/accueil-developpeur']);
        break;
      case 'profil':
        this.router.navigate(['/profile-dev']);
        break;
      case 'conversations':
        this.router.navigate(['/conversations']);
        break;
        
         case 'Recommended':
        this.router.navigate(['/recommended']);
        break;
        case 'parametres':
  this.router.navigate(['/parametres']);
  break;

      /* case 'evaluations':
    this.router.navigate(['/mes-evaluations'], {
        state: {
            type: 'developpeur',
            idEvalue: null
        }
    });*/
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
