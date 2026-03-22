import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular'; 
import { ParametresPage } from '../parametres/parametres.page';

export interface Project {
  id?: number;
  Nomduprojet: string;
  Descriptionduprojet: string;
  Publierparentreprise: string;
  Budget?: '';
  Duree?: '';
  Competences?: string;
  Statut: 'en attente' | 'en cours' | 'terminé';
  developpeurEvalue?: boolean; 
  id_developpeur?: number; 
}

@Component({
  selector: 'app-projets',
  templateUrl: './projets.page.html',
  styleUrls: ['./projets.page.scss'],
  standalone: false,
})
export class ProjetsPage implements OnInit {
  projects: any[] = [];
  selectedProject: any = null;
  statutFiltre: string = 'tous'; 
  private apiUrl = 'http://localhost/myApp/api';
enCoursCount: number = 0;
  terminesCount: number = 0;
  messagesNonLus: number = 0;
  notificationsCount: number = 0;
  private badgeInterval: any;




  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController 
  ) {}
  ngOnInit() {  
    this.route.queryParams.subscribe(params => {
      this.statutFiltre = params['statut'] || 'tous';
    });  
    this.loadProjects();
     this.loadBadges();
  this.badgeInterval = setInterval(() => this.loadBadges(), 5000);

   
    
  }
  ionViewWillEnter() {
    this.loadProjects();
  }
 loadProjects() {
    const userId = localStorage.getItem('userId'); 
    this.http.get<any[]>(`${this.apiUrl}/projects.php?userId=${userId}`)
    .subscribe({
        next: (data) => {
            this.projects = data;
        },
        error: (error) => {
            console.error('Erreur chargement projets:', error);
            this.presentToast('Erreur lors du chargement des projets', 'danger');
        }
    });
}
  get projetsFiltres() {
    if (this.statutFiltre === 'tous') {
      return this.projects;
    }
    return this.projects.filter(p => p.Statut === this.statutFiltre);
  }
  validerTravail(project: any) {
    this.http.put(`${this.apiUrl}/projects.php?id=${project.id}&action=valider`, {})
    .subscribe({
      next: (response: any) => {
        this.presentToast('Travail validé !', 'success');
        this.loadProjects();
      },
      error: (error) => {
        console.error('Erreur validation:', error);
        this.presentToast('Erreur lors de la validation', 'danger');
      }
    });
  }
  async travailARefaire(project: any) {
    const alert = await this.alertController.create({
      header: 'Travail à refaire',
      message: 'Demander au développeur de refaire ce travail ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.http.put(`${this.apiUrl}/projects.php?id=${project.id}&action=refaire`, {})
            .subscribe({
              next: () => {
                this.presentToast('Demande envoyée', 'warning');
                this.loadProjects();
              },
              error: (error) => {
                console.error('Erreur:', error);
                this.presentToast('Erreur lors de la demande', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteproject(project: any) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer ce projet ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.http.delete(`${this.apiUrl}/projects.php?id=${project.id}`)
            .subscribe({
              next: () => {
                const index = this.projects.indexOf(project);
                if (index > -1) {
                  this.projects.splice(index, 1);
                }
                this.presentToast('Projet supprimé avec succès', 'success');
                if (this.selectedProject === project) {
                  this.selectedProject = null;
                }
              },
              error: (error) => {
                console.error('Erreur suppression:', error);
                this.presentToast('Erreur lors de la suppression', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  evaluerDeveloppeur(project: any) {
  this.router.navigate(['/evaluation'], {
    state: { 
      projet: project,
      developpeurId: project.id_developpeur,
      type: 'entrepreneur' 
    }
  });
}

  editproject(project: any) {
    this.router.navigate(['/projet-creation'], { 
      queryParams: { id: project.id } 
    });
  }

  afficherDetails(project: any) {
    this.selectedProject = this.selectedProject === project ? null : project;
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
  async ouvrirParametre() {
      const modal = await this.modalController.create({
        component: ParametresPage,
        cssClass: 'settings-modal'
      });
      return await modal.present();
    }

loadBadges() {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  this.http.get<any>(`${this.apiUrl}/badge.php?userId=${userId}&role=${role}`)
    .subscribe({
      next: (data) => {
        this.messagesNonLus = data.messages;
        this.notificationsCount = data.notifications;
        this.enCoursCount = data.en_cours;
        this.terminesCount = data.termines;
      },
      error: () => {}
    });
}
ionViewWillLeave() {
  if (this.badgeInterval) clearInterval(this.badgeInterval);
}

 

   goTo(tab: string) {
    switch(tab) {/*
      case 'accueil':
        break;
      case 'mes-projets':
        this.router.navigate(['/projets']);
        break;*/
        case 'projets':
          break;
        case'accueil':
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
      /*case 'signout':
        localStorage.clear();
        this.router.navigate(['/home']);
        break;*/
        case 'parametres':
  this.router.navigate(['/parametres']);
  break;
    }
  }
}