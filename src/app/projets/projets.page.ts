/*import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ParametresPage } from '../parametres/parametres.page';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

export interface Project {
  id?: number;
  Nomduprojet: string;
  description: string;
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
  private apiUrl = environment.apiUrl;

  projects: any[] = [];
  selectedProject: any = null;
  statutFiltre: string = 'tous';
  enCoursCount: number = 0;
  terminesCount: number = 0;
  messagesNonLus: number = 0;
  notificationsCount: number = 0;
  private badgeInterval: any;
  logoEntreprise: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.statutFiltre = params['statut'] || 'tous';
    });
    this.loadProjects();
    this.loadBadges();
    this.badgeInterval = setInterval(() => this.loadBadges(), 5000);
    const logo = localStorage.getItem('logo');
  this.logoEntreprise = logo ? `http://localhost:8000/${logo}` : '';
  }
  ionViewWillEnter() {
    this.loadProjects();
  }
 
  async loadProjects() {
  const userId = localStorage.getItem('userId');
  try {
    const data = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/projects.php`, {
        params: { userId: userId! }
      })
    );
    this.projects = data;
  } catch(err) {
    this.presentToast('Erreur lors du chargement des projets', 'danger');
  }
}
  get projetsFiltres() {
    if (this.statutFiltre === 'tous') {
      return this.projects;
    }
    return this.projects.filter((p) => p.Statut === this.statutFiltre);
  }
 

  async validateReceivedWork(project: any) {
  try {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/projects.php`, {}, {
        params: { id: project.id, action: 'valider' }
      })
    );
    this.presentToast('Travail validé !', 'success');
    this.loadProjects();
  } catch(err) {
    this.presentToast('Erreur lors de la validation', 'danger');
  }
}
  async notCompliant(project: any) {
    const alert = await this.alertController.create({
      header: 'Travail à refaire',
      message:
        'Travail non conforme, merci de respecter les spécifications du projet ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.http.put(`${this.apiUrl}/projects.php`, {}, {
  params: { id: project.id, action: 'refaire' }
})
              .subscribe({
                next: () => {
                  this.presentToast('Demande envoyée', 'warning');
                  this.loadProjects();
                },
                error: (error) => {
                  console.error('Erreur:', error);
                  this.presentToast('Erreur lors de la demande', 'danger');
                },
              });
          },
        },
      ],
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
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
          
              this.http.delete(`${this.apiUrl}/projects.php`, {
  params: { id: project.id }
})
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
                },
              });
          },
        },
      ],
    });
    await alert.present();
  }
  evaluerDeveloppeur(project: any) {
    this.router.navigate(['/evaluation'], {
      state: {
        projet: project,
        developpeurId: project.id_developpeur,
        type: 'entrepreneur',
      },
    });
  }

  editproject(project: any) {
    this.router.navigate(['/projet-creation'], {
      queryParams: { id: project.id },
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
      position: 'bottom',
    });
    await toast.present();
  }
  async ouvrirParametre() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal',
    });
    return await modal.present();
  }

  loadBadges() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
  
      this.http.get<any>(`${this.apiUrl}/badge.php`, {
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
  }
  ionViewWillLeave() {
    if (this.badgeInterval) clearInterval(this.badgeInterval);
  }
getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'en attente': return 'warning';
    case 'en cours': return 'success';
    case 'terminé': return 'primary';
    default: return 'medium';
  }
  
}
getCount(statut: string): number {
  return this.projetsFiltres.filter(p => p.Statut?.toLowerCase() === statut).length;
}

getStatusClass(statut: string): string {
  return 'status-' + (statut || '').toLowerCase().replace(/ /g, '-');
}
  goTo(tab: string) {
    switch (
      tab 
    ) {
      case 'projets':
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
}*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ParametresPage } from '../parametres/parametres.page';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

export interface Project {
  id?: number;
  Nomduprojet: string;
  description: string;
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
  private apiUrl = environment.apiUrl;

  projects: any[] = [];
  missions: any[] = [];
  selectedProject: any = null;
  selectedMission: any = null;
  typeFiltre: string = 'projets';       // tous | projets | missions
  statutFiltre: string = 'tous';     // tous | en attente | en cours | terminé | accepté
  enCoursCount: number = 0;
  terminesCount: number = 0;
  messagesNonLus: number = 0;
  notificationsCount: number = 0;
  private badgeInterval: any;
  logoEntreprise: string = '';
  selectedId: any = null;
selectedType: string = '';
matchingResults: any[] = [];
matchingLoading: boolean = false;
matchingProjectId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.statutFiltre = params['statut'] || 'tous';
    });
    this.loadProjects();
    this.loadMissions();
    this.loadBadges();
    this.badgeInterval = setInterval(() => this.loadBadges(), 5000);
  

  }

  ionViewWillEnter() {
    this.loadProjects();
    this.loadMissions();
    const userId = localStorage.getItem('userId');
  this.http.get<any>(`${this.apiUrl}/profile_entrepreneur.php`, {
    params: { userId: userId! }
  }).subscribe({
    next: (profile) => {
      if (profile.logo) {
        this.logoEntreprise = profile.logo.startsWith('http')
          ? profile.logo
          : `http://localhost:8000/${profile.logo}`;
        console.log('logo chargé:', this.logoEntreprise);
      }
    }
  });
  }
/*async trouverDevs(project: any) {
  this.matchingProjectId = project.id;
  this.matchingLoading = true;
  this.matchingResults = [];

  try {
    const res: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/matching.php`, {
        titre: project.Nomduprojet,
        description: project.Descriptionduprojet || project.description,
        budget: project.Budget,
        duree: project.Duree,
      })
    );
    this.matchingResults = res.top3 || [];
  } catch (err) {
    this.presentToast('Erreur lors du matching', 'danger');
  } finally {
    this.matchingLoading = false;
  }
}*/
  async loadProjects() {
    const userId = localStorage.getItem('userId');
    try {
      const data = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/projects.php`, {
          params: { userId: userId! }
        })
      );
      console.log('PROJET EXEMPLE:', JSON.stringify(data[0]));
      this.projects = data;
    } catch (err) {
      this.presentToast('Erreur lors du chargement des projets', 'danger');
    }
  }
async loadMissions() {
  const userId = localStorage.getItem('userId');
  console.log('userId:', userId);  // ← ajoute ça
  try {
    const data = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/mission.php`, {
        params: { userId: userId! }
      })
    );
    console.log('missions reçues:', data);  // ← ajoute ça
    this.missions = data.map(m => ({
       _type: 'mission',
      ...m,
       
      Statut: m.statut,
      Nomduprojet: m.titreMission,
      Publierparentreprise: m.entreprise,
      Budget: m.budget,
      Duree: m.delai,
    }));
    console.log('missions mappées:', this.missions);  // ← ajoute ça
  } catch (err) {
    console.log('erreur missions:', err);  // ← ajoute ça
    this.presentToast('Erreur lors du chargement des missions', 'danger');
  }
}

  // ── LISTE COMBINÉE FILTRÉE ──
  get publicationsFiltrees() {
    let projets: any[] = [];
    let missions: any[] = [];

    if (this.typeFiltre === 'tous' || this.typeFiltre === 'projets') {
      projets = this.projects.map(p => ({ ...p, _type: 'projet' }));
    }
    if (this.typeFiltre === 'tous' || this.typeFiltre === 'missions') {
      missions = this.missions.map(m => ({ ...m, _type: 'mission' }));
    }

    let liste = [...projets, ...missions];

    if (this.statutFiltre !== 'tous') {
      liste = liste.filter(item => item.Statut?.toLowerCase() === this.statutFiltre);
    }

    return liste;
  }

  // Garde la compatibilité avec l'ancien getter
  get projetsFiltres() {
    if (this.statutFiltre === 'tous') return this.projects;
    return this.projects.filter(p => p.Statut === this.statutFiltre);
  }

  getCount(type: string, statut?: string): number {
    if (type === 'projets') {
      if (!statut) return this.projects.length;
      return this.projects.filter(p => p.Statut?.toLowerCase() === statut).length;
    }
    if (type === 'missions') {
      if (!statut) return this.missions.length;
      return this.missions.filter(m => m.Statut?.toLowerCase() === statut).length;
    }
    if (type === 'tous') {
      const total = [...this.projects, ...this.missions];
      if (!statut) return total.length;
      return total.filter(i => i.Statut?.toLowerCase() === statut).length;
    }
    return 0;
  }

  getStatusClass(statut: string): string {
    return 'status-' + (statut || '').toLowerCase().replace(/ /g, '-');
  }

/*  afficherDetails(item: any) {
    if (item._type === 'mission') {
      this.selectedMission = this.selectedMission === item ? null : item;
      this.selectedProject = null;
    } else {
      this.selectedProject = this.selectedProject === item ? null : item;
      this.selectedMission = null;
    }
  }

  isSelected(item: any): boolean {
    if (item._type === 'mission') return this.selectedMission === item;
    return this.selectedProject === item;
  }*/

  // ── ACTIONS PROJETS (inchangées) ──
  async validateReceivedWork(project: any) {
    try {
      await firstValueFrom(
        this.http.put(`${this.apiUrl}/projects.php`, {}, {
          params: { id: project.id, action: 'valider' }
        })
      );
      this.presentToast('Travail validé !', 'success');
      this.loadProjects();
    } catch (err) {
      this.presentToast('Erreur lors de la validation', 'danger');
    }
  }

  async notCompliant(project: any) {
    const alert = await this.alertController.create({
      header: 'Travail à refaire',
      message: 'Travail non conforme, merci de respecter les spécifications du projet ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Confirmer',
          handler: () => {
            this.http.put(`${this.apiUrl}/projects.php`, {}, {
              params: { id: project.id, action: 'refaire' }
            }).subscribe({
              next: () => {
                this.presentToast('Demande envoyée', 'warning');
                this.loadProjects();
              },
              error: (error) => {
                console.error('Erreur:', error);
                this.presentToast('Erreur lors de la demande', 'danger');
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }
  

  async deleteproject(project: any) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer ce projet ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.http.delete(`${this.apiUrl}/projects.php`, {
              params: { id: project.id }
            }).subscribe({
             /* next: () => {
                const index = this.projects.indexOf(project);
                if (index > -1) this.projects.splice(index, 1);
                this.presentToast('Projet supprimé avec succès', 'success');
                if (this.selectedProject === project) this.selectedProject = null;
              },*/
              next: () => {
  const index = this.projects.findIndex(p => p.id === project.id);
  if (index > -1) this.projects.splice(index, 1);
  this.presentToast('Projet supprimé avec succès', 'success');
  this.selectedId = null;
  this.selectedType = '';
},
              error: (error) => {
                console.error('Erreur suppression:', error);
                this.presentToast('Erreur lors de la suppression', 'danger');
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteMission(mission: any) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cette mission ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.http.delete(`${this.apiUrl}/mission.php`, {
              params: { id: mission.id }
            }).subscribe({
             /* next: () => {
                const index = this.missions.indexOf(mission);
                if (index > -1) this.missions.splice(index, 1);
                this.presentToast('Mission supprimée avec succès', 'success');
                if (this.selectedMission === mission) this.selectedMission = null;
              },*/
              next: () => {
  const index = this.missions.findIndex(m => m.id === mission.id);
  if (index > -1) this.missions.splice(index, 1);
  this.presentToast('Mission supprimée avec succès', 'success');
  this.selectedId = null;
  this.selectedType = '';
},
              error: () => this.presentToast('Erreur lors de la suppression', 'danger'),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  editMission(mission: any) {
  this.router.navigate(['/projet-creation'], {
    queryParams: { id: mission.id, type: 'mission' },
  });
}

  evaluerDeveloppeur(project: any) {
    this.router.navigate(['/evaluation'], {
      state: {
        projet: project,
        developpeurId: project.id_developpeur,
        type: 'entrepreneur',
      },
    });
  }

  editproject(project: any) {
    this.router.navigate(['/projet-creation'], {
      queryParams: { id: project.id },
    });
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }

  async ouvrirParametre() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal',
    });
    return await modal.present();
  }

  loadBadges() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    this.http.get<any>(`${this.apiUrl}/badge.php`, {
      params: { userId: userId!, role: role! }
    }).subscribe({
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

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'en attente': return 'warning';
      case 'en cours': return 'success';
      case 'terminé': return 'primary';
      case 'accepté': return 'tertiary';
      default: return 'medium';
    }
  }
afficherDetails(item: any) {
  if (this.selectedId === item.id && this.selectedType === item._type) {
    this.selectedId = null;
    this.selectedType = '';
  } else {
    this.selectedId = item.id;
    this.selectedType = item._type;
  }
}

isSelected(item: any): boolean {
  return this.selectedId === item.id && this.selectedType === item._type;
}
async trouverDevs(project: any) {
  console.log('trouverDevs appelé:', project);
  this.matchingProjectId = project.id;
  this.matchingLoading = true;
  this.matchingResults = [];

  try {
    const res: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/matching.php`, {
        titre: project.Nomduprojet,
        description: project.Descriptionduprojet || project.description,
        budget: project.Budget,
        duree: project.Duree,
      })
    );
    console.log('résultat matching:', res);
    this.matchingResults = res.top3 || [];
  } catch (err) {
    console.log('erreur matching:', err);
    this.presentToast('Erreur lors du matching', 'danger');
  } finally {
    this.matchingLoading = false;
  }
}
  goTo(tab: string) {
    switch (tab) {
      case 'projets':
        break;
      /*case 'mes-projets':
        this.router.navigate(['/projets']);
        break;*/
      case 'profil':
        this.router.navigate(['/profile-entrepreneur']);
        break;
      case 'conversations':
        this.router.navigate(['/conversations']);
        break;
      case 'dashboard':
        this.router.navigate(['/dashboard-entrepreneur']);
        break;
       case 'meswork':
        this.router.navigate(['/mes-workshops']);
        break;
        case 'accueil':
        this.router.navigate(['/accueil-entrepreneur']);
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
  voirProfilDev(dev: any) {
  this.router.navigate(['/profile-dev'], {
    queryParams: { view: 'summary', user_id: dev.user_id }
  });
}

contacterDev(dev: any) {
  this.router.navigate(['/chat'], {
    queryParams: { userId: dev.user_id }
  });
}
}
