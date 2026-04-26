import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ParametresPage } from '../parametres/parametres.page';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { BadgeService } from '../shared/services/badge.service';

interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  description: string;
}

export interface Project {
  id?: number;
  Nomduprojet: string;
  Publierparentreprise: string;
  Budget: string;
  Duree: string;
  Competences: string;
  Statut: string;
  id_categorie: string;
  nom_categorie?: string;
  description: string;
  DatePublication?: Date | string;

  entrepreneur?: {
    id: number;
    Nom: string;
    Prenom: string;
    Entreprise: string;
    logo?: string;
    photo?: string;
    Secteur: string;
    
    AnneeCreation?: number;
    Ville?: string;
    Pays?: string;
    SiteWeb?: string;
    Linkedin?: string;
    BudgetMoyen?: number;
    moyenneNote?: number;
    user_id?: number;
  };
}

@Component({
  selector: 'app-accueil-developpeur',
  templateUrl: './accueil-developpeur.page.html',
  styleUrls: ['./accueil-developpeur.page.scss'],
  standalone: false,
})
export class AccueilDeveloppeurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  searchTerm = '';
  selectedCompetence = '';
  selectedStatus = '';
  selectedCategorie = '';
  sortBy = 'recent';
  notificationsCount: number = 0;

  allProjects: Project[] = [];
 displayedProjects: any[] = [];
  savedProjects: number[] = [];

  allMissions: any[] = [];
displayedMissions: any[] = [];
savedMissions: number[] = [];

  CompetencesList: string[] = [];
  statusList: string[] = [];
  categoriesList: Categorie[] = [];

  messagesNonLus: number = 0;
  private badgeInterval: any;

  isLoading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController,
     private badgeService: BadgeService,
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProjects();
    this.loadSavedProjects();
    this.loadBadges();
    this.loadMissions();
    this.badgeInterval = setInterval(() => this.loadBadges(), 5000);
    setInterval(() => {
    this.loadProjects();
    this.loadMissions();
  }, 30000);
    
  }

 async loadCategories() {
  try {
    const categories = await firstValueFrom(
      this.http.get<Categorie[]>(`${this.apiUrl}/categories.php`)
    );
    this.categoriesList = categories;
  } catch(err) {
    console.error('Erreur chargement catégories :', err);
  }
}
/*
async loadMissions() {
  try {
    const missions = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/mission.php`)
    );
    this.allMissions = missions;
    this.displayedMissions = [...missions];
  } catch(err) {
    console.error('Erreur chargement missions :', err);
  }
}*/
async loadMissions() {
  try {
    const missions = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/mission.php`)
    );
    this.allMissions = missions;
    this.displayedMissions = [...missions];
    this.applyFilters(); // ← AJOUTER ÇA
  } catch(err) {
    console.error('Erreur chargement missions :', err);
  }
}

  ionViewWillEnter() {
    this.loadBadges();
    this.loadProjects();  
  this.loadMissions();  
  }
 
 async loadProjects() {
  this.isLoading = true;
  try {
    const projects = await firstValueFrom(
      this.http.get<Project[]>(`${this.apiUrl}/projects.php`)
    );
    this.allProjects = projects;
    this.displayedProjects = [...projects];
    this.initFilters();
    this.applyFilters();
    this.isLoading = false;
  } catch(err) {
    this.isLoading = false;
  }
}
  initFilters() {
    const allCompetences = this.allProjects
      .flatMap((p) => p.Competences?.split(',').map((c) => c.trim()) || [])
      .filter((c) => c);
    this.CompetencesList = [...new Set(allCompetences)];
    this.statusList = [
      ...new Set(this.allProjects.map((p) => p.Statut).filter((s) => s)),
    ];
  }
  onSearch() {
    this.applyFilters();
  }
  onFilter() {
    this.applyFilters();
  }
  applyFilters() {
  const term = this.searchTerm.toLowerCase().trim();

  const projets = this.allProjects
    .filter(project => {
      const matchSearch = !term ||
        project.Nomduprojet?.toLowerCase().includes(term) ||
        project.Competences?.toLowerCase().includes(term) ||
        project.entrepreneur?.Nom?.toLowerCase().includes(term) ||
        project.entrepreneur?.Entreprise?.toLowerCase().includes(term);
      const matchCategorie = !this.selectedCategorie ||
        Number(project.id_categorie) === Number(this.selectedCategorie);
      return matchSearch && matchCategorie;
    })
    .map(p => ({ ...p, _type: 'projet' }));

  const missions = this.allMissions
    .filter(mission => {
      const matchSearch = !term ||
        mission.titreMission?.toLowerCase().includes(term) ||
        mission.entreprise?.toLowerCase().includes(term);
      const matchCategorie = !this.selectedCategorie ||
        Number(mission.id_categorie) === Number(this.selectedCategorie);
      return matchSearch && matchCategorie;
    })
    .map(m => ({ ...m, _type: 'mission' }));

  this.displayedProjects = [...projets, ...missions].sort((a: any, b: any) => {
    const dateA = new Date(a.DatePublication || 0).getTime();
    const dateB = new Date(b.DatePublication || 0).getTime();
    return dateB - dateA;
  });

  this.displayedMissions = [];
}
 
  sortProjects(projects: Project[]): Project[] {
    switch (this.sortBy) {
      case 'recent':
        return projects.sort((a, b) => {
          const dateA = new Date(a.DatePublication || 0).getTime();
          const dateB = new Date(b.DatePublication || 0).getTime();
          return dateB - dateA;
        });
      case 'budget-high':
        return projects.sort((a, b) => {
          const budgetA = parseFloat(String(a.Budget).replace(',', '.') || '0');
          const budgetB = parseFloat(String(b.Budget).replace(',', '.') || '0');
          return budgetB - budgetA;
        });
      case 'budget-low':
        return projects.sort((a, b) => {
          const budgetA = parseFloat(String(a.Budget).replace(',', '.') || '0');
          const budgetB = parseFloat(String(b.Budget).replace(',', '.') || '0');
          return budgetA - budgetB;
        });
      default:
        return projects;
    }
  }
  isMissionSaved(mission: any): boolean {
  return this.savedMissions.includes(mission.id);
}

saveMission(mission: any) {
  if (!mission.id) return;
  const index = this.savedMissions.indexOf(mission.id);
  if (index > -1) {
    this.http.delete(`${this.apiUrl}/favorites.php`, {
      params: { mission_id: mission.id, id_developpeur: localStorage.getItem('userId')! }
    }).subscribe({
      next: () => { this.savedMissions.splice(index, 1); },
      error: () => {}
    });
  } else {
    this.http.post(`${this.apiUrl}/favorites.php`, {
      mission_id: mission.id,
      id_developpeur: localStorage.getItem('userId'),
    }).subscribe({
      next: () => { this.savedMissions.push(mission.id); },
      error: () => {}
    });
  }
}
  resetFilters() {
    this.searchTerm = '';
    this.selectedCompetence = '';
    this.selectedStatus = '';
    this.selectedCategorie = '';
    this.sortBy = 'recent';
    this.applyFilters();
    this.displayedMissions = [...this.allMissions];
  }
  getStars(note: number | undefined): string[] {
    const stars: string[] = [];
    const n = note || 0;
    for (let i = 1; i <= 5; i++) {
      if (n >= i) stars.push('full');
      else if (n >= i - 0.5) stars.push('half');
      else stars.push('empty');
    }
    return stars;
  }
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'en attente':
        return 'warning';
      case 'en cours':
        return 'success';
      case 'terminé':
        return 'primary';
      default:
        return 'medium';
    }
  }
  getStatutLabel(statut: string): string {
  const map: any = {
    'En attente': 'STATUT.en_attente',
    'Accepté': 'STATUT.accepte',
    'Refusé': 'STATUT.refuse',
    'Terminé': 'STATUT.termine',
    'Ouvert': 'STATUT.ouvert',
    'Fermé': 'STATUT.ferme'
  };
  return map[statut] || statut;
}
  isNewProject(project: Project): boolean {
    if (!project.DatePublication) return false;

    const projectDate = new Date(project.DatePublication);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - projectDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }
  saveProject(project: Project) {
    if (!project.id) return;
    const projectId = project.id;
    const index = this.savedProjects.indexOf(projectId);
    if (index > -1) {
   
       this.http.delete(`${this.apiUrl}/favorites.php`, {
  params: { id: projectId, id_developpeur: localStorage.getItem('userId')! }
})
        .subscribe({
          next: () => {
            this.savedProjects.splice(index, 1);
            localStorage.setItem(
              'savedProjects',
              JSON.stringify(this.savedProjects),
            );
          },
          error: () => {},
        });
    } else {
      this.http
        .post(`${this.apiUrl}/favorites.php`, {
          project_id: projectId,
          id_developpeur: localStorage.getItem('userId'),
        })
        .subscribe({
          next: () => {
            this.savedProjects.push(projectId);
            localStorage.setItem(
              'savedProjects',
              JSON.stringify(this.savedProjects),
            );
          },
          error: () => {},
        });
    }
  }
  isProjectSaved(project: Project): boolean {
    return project.id ? this.savedProjects.includes(project.id) : false;
  }

async loadSavedProjects() {
  const id_developpeur = localStorage.getItem('userId');
  try {
    const favorites = await firstValueFrom(
      this.http.get<{ project_id: number, mission_id: number }[]>(`${this.apiUrl}/favorites.php`, {
        params: { id_developpeur: id_developpeur! }
      })
    );
    this.savedProjects = favorites.filter(f => f.project_id).map(f => f.project_id);
    this.savedMissions = favorites.filter(f => f.mission_id).map(f => f.mission_id);
  } catch(err) {
    const saved = localStorage.getItem('savedProjects');
    if (saved) this.savedProjects = JSON.parse(saved);
  }
}
  openDescription(project: Project) {
    localStorage.removeItem('selectedMission');
    localStorage.setItem('selectedProject', JSON.stringify(project));
    this.router.navigate(['/description']);
  }
  onContact(project: Project) {
    if (!project.id) return;

    this.router.navigate(['/chat'], {
      queryParams: {
        projectId: project.id,
        userId: project.entrepreneur?.user_id,
      },
    });
  }
  async openSettings() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal',
    });
    return await modal.present();
  }
  ouvrirRecommended() {
    this.router.navigate(['/recommended']);
  }
  ionViewWillLeave() {
    if (this.badgeInterval) clearInterval(this.badgeInterval);
  }


  loadBadges() {
  this.badgeService.getBadges().subscribe({
    next: (data) => {
      this.messagesNonLus = data.messages;
      this.notificationsCount = data.notifications;
    },
    error: () => {},
  });
}
postulerMission(mission: any) {
  localStorage.removeItem('selectedMission');
  localStorage.setItem('selectedMission', JSON.stringify(mission));
  this.router.navigate(['/description']);
}
/*
contacterMission(mission: any) {
  this.router.navigate(['/chat'], {
    queryParams: {
      missionId: mission.id,
     userId: mission.user_id,
    },
  });
}*/
contacterMission(mission: any) {
  this.router.navigate(['/chat'], {
    queryParams: {
      missionId: mission.id,
      userId: mission.entrepreneur.user_id,  
    },
  });
}

voirProfilEntrepreneur(item: any) {
  const userId = item.entrepreneur?.user_id;
  if (!userId) return;
  this.router.navigate(['/profile-entrepreneur'], {
    queryParams: { view: 'summary', user_id: userId }
  });
}
  goTo(tab: string) {
    switch (tab) {
      case 'accueil':
        break;
      case 'mes-postulation':
        this.router.navigate(['/postulation']);
        break;
      case 'profil':
        this.router.navigate(['/profile-dev']);
        break;
      case 'conversations':
        this.router.navigate(['/conversations']);
        break;

      case 'dashboard-dev':
        this.router.navigate(['/dashboard-dev']);
        break;
         case 'workshops':
        this.router.navigate(['/workshops']);
        break;
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
