import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular'; 
import { ParametresPage } from '../parametres/parametres.page';


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
  Descriptionduprojet: string;
  DatePublication?: Date | string;
  
  entrepreneur?: {
    id: number;
    Nom: string;
    Prenom: string;
    Entreprise: string;
    photo?: string;
    Secteur: string;
    TailleEntreprise?: string;
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
  standalone: false
})
export class AccueilDeveloppeurPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';



  searchTerm = '';
  selectedCompetence = '';
  selectedStatus = '';
  selectedCategorie = '';
  sortBy = 'recent';
  notificationsCount: number = 0;

  allProjects: Project[] = [];
  displayedProjects: Project[] = [];
  savedProjects: number[] = [];

  CompetencesList: string[] = [];
  statusList: string[] = [];
  categoriesList: Categorie[] = [];

  messagesNonLus: number = 0;
private badgeInterval: any;

  isLoading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController 
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProjects();
    this.loadSavedProjects();
    this.loadBadges();
    this.badgeInterval = setInterval(() => this.loadBadges(), 5000);
    
    
  }

  loadCategories() {
    this.http.get<Categorie[]>(`${this.apiUrl}/categories.php`)

      .subscribe({
        next: (categories) => {
          this.categoriesList = categories;
          console.log('Catégories chargées :', this.categoriesList);
        },
        error: (error) => {
          console.error('Erreur chargement catégories :', error);
        }
      });
  }

  loadProjects() {
    this.isLoading = true;
    
    this.http.get<Project[]>(`${this.apiUrl}/projects.php`)
      .subscribe({
        next: (projects) => {
          this.allProjects = projects;
          this.displayedProjects = [...projects];
          this.initFilters();
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }
 initFilters() {
    const allCompetences = this.allProjects
        .flatMap(p => p.Competences?.split(',').map(c => c.trim()) || [])
        .filter(c => c);
    this.CompetencesList = [...new Set(allCompetences)];
    this.statusList = [
        ...new Set(
            this.allProjects.map(p => p.Statut).filter(s => s)
        )
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
    let filtered = this.allProjects.filter(project => {
        const matchSearch =
    !term ||
    project.Nomduprojet?.toLowerCase().includes(term) ||
    project.Competences?.toLowerCase().includes(term) ||
    project.entrepreneur?.Nom?.toLowerCase().includes(term) ||
    project.entrepreneur?.Prenom?.toLowerCase().includes(term) ||
    project.entrepreneur?.Entreprise?.toLowerCase().includes(term);
        const matchCompetence =
    !this.selectedCompetence ||
    project.Competences?.toLowerCase().includes(this.selectedCompetence.toLowerCase());
       const matchStatus =
        !this.selectedStatus ||
        project.Statut === this.selectedStatus;
const matchCategorie =
    !this.selectedCategorie ||
    Number(project.id_categorie) === Number(this.selectedCategorie);
      return matchSearch && matchCompetence && matchStatus && matchCategorie;
    });
    filtered = this.sortProjects(filtered);
    this.displayedProjects = filtered;
  }
  sortProjects(projects: Project[]): Project[] {
    switch(this.sortBy) {
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
  resetFilters() {
    this.searchTerm = '';
    this.selectedCompetence = '';
    this.selectedStatus = '';
    this.selectedCategorie = '';
    this.sortBy = 'recent';
    this.applyFilters();
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
    switch(status?.toLowerCase()) {
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
      this.http.delete(`${this.apiUrl}/favorites.php?id=${projectId}&id_developpeur=${localStorage.getItem('userId')}`)
        .subscribe({
          next: () => {
            this.savedProjects.splice(index, 1);
            localStorage.setItem('savedProjects', JSON.stringify(this.savedProjects));
          },
          error: () => {}
        });
    } else {
     this.http.post(`${this.apiUrl}/favorites.php`, { 
    project_id: projectId,
    id_developpeur: localStorage.getItem('userId')
})
        .subscribe({
          next: () => {
            this.savedProjects.push(projectId);
            localStorage.setItem('savedProjects', JSON.stringify(this.savedProjects));
          },
          error: () => {}
        });
    }
  }
  isProjectSaved(project: Project): boolean {
    return project.id ? this.savedProjects.includes(project.id) : false;
  }
 loadSavedProjects() {
    const id_developpeur = localStorage.getItem('userId');
    this.http.get<{project_id: number}[]>(
        `${this.apiUrl}/favorites.php?id_developpeur=${id_developpeur}`)
        .subscribe({
            next: (favorites) => {
                this.savedProjects = favorites.map(f => f.project_id);
            },
            error: () => {
                const saved = localStorage.getItem('savedProjects');
                if (saved) {
                    this.savedProjects = JSON.parse(saved);
                }
            }
        });
}
  openDescription(project: Project) {
    localStorage.setItem('selectedProject', JSON.stringify(project));
    this.router.navigate(['/description']);
  }
 onContact(project: Project) {
  if (!project.id) return;

  this.router.navigate(['/chat'], {
    queryParams: { 
      projectId: project.id,
      userId: project.entrepreneur?.user_id
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
  ouvrirRecommended() {
  this.router.navigate(['/recommended']);
}
ionViewWillLeave() {
    if (this.badgeInterval) clearInterval(this.badgeInterval);
}

loadBadges() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    this.http.get<any>(`${this.apiUrl}/badge.php?userId=${userId}&role=${role}`)
        .subscribe({
            next: (data) => {
                this.messagesNonLus = data.messages;
                this.notificationsCount = data.notifications;
            },
            error: () => {}
        });
}
  goTo(tab: string) {
    switch(tab) {
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