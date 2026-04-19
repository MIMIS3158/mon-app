/*import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '../shared/services/alerts.service';
import { environment } from 'src/environments/environment';

interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  description: string;
}

@Component({
  selector: 'app-projet-creation',
  templateUrl: './projet-creation.page.html',
  styleUrls: ['./projet-creation.page.scss'],
  standalone: false,
})
export class ProjetCreationPage implements OnInit {
  private apiUrl = environment.apiUrl;
  private projectApiUrl = this.apiUrl + '/project.php';
  private categoriesUrl = this.apiUrl + '/categories.php';
  private missionApiUrl = this.apiUrl + '/mission.php';

  categories: Categorie[] = [];

  newProject: any = {
    Nomduprojet: '',
    Publierparentreprise: '',
    Budget: '',
    Duree: '',

    Statut: 'en attente',
    id_categorie: null,
    description: '',
  };
  newMission = {
  titreMission: '',
  entreprise: '',       
  budget: '',
  delai: '',
  niveauExperience: '',
  typeMission: '',
  id_categorie: null,
  description: ''
};
  isEditMode: boolean = false;
  projectId: number | null = null;
  activeTab: string = 'projet';
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
     this.newProject.Publierparentreprise = localStorage.getItem('entreprise') || '';
     this.newMission.entreprise = localStorage.getItem('entreprise') || '';
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = params['id'];
        this.loadProject(this.projectId);
      }
    });
  }
 
  loadProject(id: any) {
    
      this.http.get<any>(`${this.apiUrl}/projects.php`, {
  params: { projectId: id }
})
      .subscribe({
        next: (project) => {
          if (!project) return;
          this.newProject = {
            Nomduprojet: project.Nomduprojet || '',
            Publierparentreprise: project.Publierparentreprise || '',
            Budget: project.Budget || '',
            Duree: project.Duree || '',
            //Competences: project.Competences || '',
            Statut: project.Statut || 'en attente',
            id_categorie: project.id_categorie || null,
            description: project.description || '',
          };
        },
        error: () => {},
      });
  }
  loadCategories() {
    this.http.get<Categorie[]>(this.categoriesUrl).subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories chargées :', this.categories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories :', error);
        this.alertsService.alert('Impossible de charger les catégories');
      },
    });
  }
  addProject() {
    if (!this.isValid()) return;
    const projectData = {
      ...this.newProject,
      user_id: localStorage.getItem('userId'),
    };
    if (this.isEditMode && this.projectId) {
     
        this.http.put(`${this.projectApiUrl}`, projectData, {
  params: { id: this.projectId! }
})
        .subscribe({
          next: () => {
            this.alertsService.alert('Projet modifié avec succès !');
            this.router.navigate(['/projets']);
          },
          error: (err) => {
            console.error('Erreur lors de la modification :', err);
            const message = err.error?.error || 'Erreur inconnue';
            this.alertsService.alert(
              'Erreur lors de la modification : ' + message,
            );
          },
        });
    } else {
      this.http.post(this.projectApiUrl, projectData).subscribe({
        next: () => {
          this.alertsService.alert('Projet publié avec succès !');
          this.router.navigate(['/accueil-entrepreneur']);
        },
        error: (err) => {
          console.error('Erreur lors de la publication :', err);
          const message = err.error?.error || 'Erreur inconnue';
          this.alertsService.alert(
            'Erreur lors de la publication : ' + message,
          );
        },
      });
    }
  }
  isValid(): boolean {
    if (!this.newProject.Nomduprojet?.trim()) {
      this.alertsService.alert('Le nom du projet est requis');
      return false;
    }
    if (!this.newProject.Budget) {
      this.alertsService.alert('Le budget est requis');
      return false;
    }
    if (!this.newProject.id_categorie) {
      this.alertsService.alert('Veuillez sélectionner une catégorie');
      return false;
    }
    return true;
  }
 addMission() {
  if (!this.isValidMission()) return;

  const missionData = {
    ...this.newMission,
    user_id: localStorage.getItem('userId'),
  };

  this.http.post(this.missionApiUrl, missionData).subscribe({
    next: () => {
      this.alertsService.toast('Mission publiée avec succès !');
      this.router.navigate(['/accueil-entrepreneur']);
    },
    error: (err) => {
      console.error('Erreur :', err);
      const message = err.error?.errors?.[0] || err.error?.error || 'Erreur inconnue';
      this.alertsService.alert(message, 'Erreur');
    },
  });
}

isValidMission(): boolean {
  if (!this.newMission.titreMission?.trim()) {
    this.alertsService.alert('Le titre de la mission est requis', 'Champ manquant');
    return false;
  }
  if (!this.newMission.budget?.trim()) {
    this.alertsService.alert('Le budget est requis', 'Champ manquant');
    return false;
  }
  if (!this.newMission.delai?.trim()) {
    this.alertsService.alert('Le délai de livraison est requis', 'Champ manquant');
    return false;
  }
  if (!this.newMission.niveauExperience) {
    this.alertsService.alert("Le niveau d'expérience est requis", 'Champ manquant');
    return false;
  }
  if (!this.newMission.typeMission) {
    this.alertsService.alert('Le type de mission est requis', 'Champ manquant');
    return false;
  }
  if (!this.newMission.id_categorie) {
    this.alertsService.alert('Veuillez sélectionner une catégorie', 'Champ manquant');
    return false;
  }
  return true;
}
}*/
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '../shared/services/alerts.service';
import { environment } from 'src/environments/environment';

interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  description: string;
}

@Component({
  selector: 'app-projet-creation',
  templateUrl: './projet-creation.page.html',
  styleUrls: ['./projet-creation.page.scss'],
  standalone: false,
})
export class ProjetCreationPage implements OnInit {
  private apiUrl = environment.apiUrl;
  private projectApiUrl = this.apiUrl + '/project.php';
  private categoriesUrl = this.apiUrl + '/categories.php';
  private missionApiUrl = this.apiUrl + '/mission.php';

  categories: Categorie[] = [];

  newProject: any = {
    Nomduprojet: '',
    Publierparentreprise: '',
    Budget: '',
    Duree: '',
    Statut: 'en attente',
    //id_categorie: null,
     id_categorie: [],
    description: '',
  };

  newMission = {
    titreMission: '',
    entreprise: '',
    budget: '',
    delai: '',
    niveauExperience: '',
    typeMission: '',
    //id_categorie: null as any,
    id_categorie: [] as any,
    description: ''
  };
limiteProjets: number = 6;
projetsActifs: number = 0;
isPremium: boolean = false;
showPremiumModal: boolean = false;
  isEditMode: boolean = false;
  projectId: number | null = null;
  activeTab: string = 'projet';
  missionsActives: number = 0;
  

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.newProject.Publierparentreprise = localStorage.getItem('entreprise') || '';
    this.newMission.entreprise = localStorage.getItem('entreprise') || '';

    // Charge les catégories D'ABORD, puis le projet
    /*this.loadCategories().then(() => {
      this.route.queryParams.subscribe((params) => {
        if (params['id']) {
          this.isEditMode = true;
          this.projectId = params['id'];
          this.loadProject(this.projectId);
        }
      });
    });*/
    this.loadCategories().then(() => {
  this.route.queryParams.subscribe((params) => {
    if (params['id']) {
      this.isEditMode = true;
      this.projectId = params['id'];
      if (params['type'] === 'mission') {
        this.activeTab = 'mission';
        this.loadMission(this.projectId);
      } else {
        this.activeTab = 'projet';
        this.loadProject(this.projectId);
      }
    }
  });
});
  }

  // Retourne une Promise pour attendre la fin du chargement
  loadCategories(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<Categorie[]>(this.categoriesUrl).subscribe({
        next: (data) => {
          this.categories = data;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des catégories :', error);
          this.alertsService.alert('Impossible de charger les catégories');
          resolve();
        },
      });
    });
  }

  /*loadProject(id: any) {
    this.http.get<any>(`${this.apiUrl}/projects.php`, {
      params: { projectId: id }
    }).subscribe({
      next: (project) => {
        if (!project) return;
        this.newProject = {
          Nomduprojet: project.Nomduprojet || '',
          Publierparentreprise: project.Publierparentreprise || '',
          Budget: project.Budget || '',
          Duree: project.Duree || '',
          Statut: project.Statut || 'en attente',
          id_categorie: project.id_categorie ? Number(project.id_categorie) : null,
          description: project.Descriptionduprojet || project.description || '',
        };
      },
      error: () => {},
    });
  }*/
 loadProject(id: any) {
  this.http.get<any>(`${this.apiUrl}/projects.php`, {
    params: { projectId: id }
  }).subscribe({
    next: (project) => {
      if (!project) return;

      // ← AJOUTE CES 3 LIGNES
      console.log('projet:', project);
      console.log('id_categorie:', project.id_categorie, typeof project.id_categorie);
      console.log('categories:', this.categories);

      this.newProject = {
        Nomduprojet: project.Nomduprojet || '',
        Publierparentreprise: project.Publierparentreprise || '',
        Budget: project.Budget || '',
        Duree: project.Duree || '',
        Statut: project.Statut || 'en attente',
        id_categorie: project.id_categorie ? Number(project.id_categorie) : null,
        description: project.Descriptionduprojet || project.description || '',
      };
    },
    error: () => {},
  });
}

 //async addProject() {
   // if (!this.isValid()) return;
    // await this.checkLimite();
 /* const totalPublications = this.projetsActifs + this.missionsActives;
if (!this.isPremium && totalPublications >= this.limiteProjets && !this.isEditMode) {*/
//if (!this.isPremium && this.projetsActifs >= 3 && !this.isEditMode) {
   // this.showPremiumModal = true;
   // return;
  //}
  async addProject() {
  if (!this.isValid()) return;
  await this.checkLimite();
  console.log('projetsActifs:', this.projetsActifs);
  console.log('isPremium:', this.isPremium);
  console.log('isEditMode:', this.isEditMode);
  
  if (!this.isPremium && this.projetsActifs >= 3 && !this.isEditMode) {
    this.showPremiumModal = true;
    return;
  }
    const projectData = {
      ...this.newProject,
      user_id: localStorage.getItem('userId'),
    };
    if (this.isEditMode && this.projectId) {
      this.http.put(`${this.projectApiUrl}`, projectData, {
        params: { id: this.projectId! }
      }).subscribe({
        next: () => {
          this.alertsService.alert('Projet modifié avec succès !');
          this.router.navigate(['/projets']);
        },
        error: (err) => {
          console.error('Erreur lors de la modification :', err);
          const message = err.error?.error || 'Erreur inconnue';
          this.alertsService.alert('Erreur lors de la modification : ' + message);
        },
      });
    } else {
      this.http.post(this.projectApiUrl, projectData).subscribe({
        next: () => {
          this.alertsService.alert('Projet publié avec succès !');
          this.router.navigate(['/accueil-entrepreneur']);
        },
        error: (err) => {
          console.error('Erreur lors de la publication :', err);
          const message = err.error?.error || 'Erreur inconnue';
          this.alertsService.alert('Erreur lors de la publication : ' + message);
        },
      });
    }
  }

  isValid(): boolean {
    if (!this.newProject.Nomduprojet?.trim()) {
      this.alertsService.alert('Le nom du projet est requis');
      return false;
    }
    if (!this.newProject.Budget) {
      this.alertsService.alert('Le budget est requis');
      return false;
    }
   /* if (!this.newProject.id_categorie) {
      this.alertsService.alert('Veuillez sélectionner une catégorie');
      return false;
    }*/
    if (!this.newProject.id_categorie || this.newProject.id_categorie.length === 0) {
  this.alertsService.alert('Veuillez sélectionner une catégorie');
  return false;
}
    return true;
  }

  /*addMission() {
    if (!this.isValidMission()) return;
    const missionData = {
      ...this.newMission,
      user_id: localStorage.getItem('userId'),
    };
    this.http.post(this.missionApiUrl, missionData).subscribe({
      next: () => {
        this.alertsService.toast('Mission publiée avec succès !');
        this.router.navigate(['/accueil-entrepreneur']);
      },
      error: (err) => {
        console.error('Erreur :', err);
        const message = err.error?.errors?.[0] || err.error?.error || 'Erreur inconnue';
        this.alertsService.alert(message, 'Erreur');
      },
    });
  }*/
 /*async addMission() {
  if (!this.isValidMission()) return;
   // Vérification limite plan gratuit
  await this.checkLimite();
 // if (!this.isPremium && this.missionsActives >= this.limiteProjets && !this.isEditMode) {
 //if (!this.isPremium && (this.missionsActives + 1) > 3 && !this.isEditMode) {
 if (!this.isPremium && this.missionsActives >= 3 && !this.isEditMode) {

    this.showPremiumModal = true;
    return;
  }*/
 async addMission() {
  if (!this.isValidMission()) return;
  await this.checkLimite();

  if (!this.isPremium && this.missionsActives >= 3 && !this.isEditMode) {
    this.showPremiumModal = true;
    return;
  }
  const missionData = {
    ...this.newMission,
    user_id: localStorage.getItem('userId'),
  };
  if (this.isEditMode && this.projectId) {
    this.http.put(`${this.missionApiUrl}`, missionData, {
      params: { id: this.projectId! }
    }).subscribe({
      next: () => {
        this.alertsService.alert('Mission modifiée avec succès !');
        this.router.navigate(['/projets']);
      },
      error: (err) => {
        const message = err.error?.errors?.[0] || err.error?.error || 'Erreur inconnue';
        this.alertsService.alert(message, 'Erreur');
      },
    });
  } else {
    this.http.post(this.missionApiUrl, missionData).subscribe({
      next: () => {
        this.alertsService.toast('Mission publiée avec succès !');
        this.router.navigate(['/accueil-entrepreneur']);
      },
      error: (err) => {
        const message = err.error?.errors?.[0] || err.error?.error || 'Erreur inconnue';
        this.alertsService.alert(message, 'Erreur');
      },
    });
  }
}

  isValidMission(): boolean {
    if (!this.newMission.titreMission?.trim()) {
      this.alertsService.alert('Le titre de la mission est requis', 'Champ manquant');
      return false;
    }
    if (!this.newMission.budget?.trim()) {
      this.alertsService.alert('Le budget est requis', 'Champ manquant');
      return false;
    }
    if (!this.newMission.delai?.trim()) {
      this.alertsService.alert('Le délai de livraison est requis', 'Champ manquant');
      return false;
    }
    if (!this.newMission.niveauExperience) {
      this.alertsService.alert("Le niveau d'expérience est requis", 'Champ manquant');
      return false;
    }
    if (!this.newMission.typeMission) {
      this.alertsService.alert('Le type de mission est requis', 'Champ manquant');
      return false;
    }
   /* if (!this.newMission.id_categorie) {
      this.alertsService.alert('Veuillez sélectionner une catégorie', 'Champ manquant');
      return false;
    }*/
    if (!this.newMission.id_categorie || this.newMission.id_categorie.length === 0) {
  this.alertsService.alert('Veuillez sélectionner une catégorie', 'Champ manquant');
  return false;
}
    return true;
  }
  compareCategorie(a: any, b: any): boolean {
  return Number(a) === Number(b);
}
loadMission(id: any) {
  this.http.get<any>(`${this.apiUrl}/mission.php`, {
    params: { missionId: id }
  }).subscribe({
    next: (mission) => {
      
      if (!mission) return;
      this.newMission = {
        titreMission: mission.titreMission || '',
        entreprise: mission.entreprise || '',
        budget: mission.budget || '',
        delai: mission.delai || '',
        niveauExperience: mission.niveauExperience || '',
        typeMission: mission.typeMission || '',
        id_categorie: mission.id_categorie ? Number(mission.id_categorie) : null,
        description: mission.description || '',
      };
    },
    error: () => {},
  });
}/*
checkLimite(): Promise<boolean> {
  const userId = localStorage.getItem('userId');
  return new Promise((resolve) => {
    this.http.get<any>(`${this.apiUrl}/dashboard.php`, {
      params: { userId: userId! }
    }).subscribe({
      next: (data) => {
        //this.projetsActifs = data.projets_actifs ?? data.total_projets;
        this.projetsActifs = data.projets_actifs ?? data.total_projets;
this.missionsActives = data.missions_actives ?? 0;
        this.isPremium = data.is_premium ?? false;
        resolve(true);
      },
      error: () => resolve(true)
    });
  });
}*/
checkLimite(): Promise<boolean> {
  const userId = localStorage.getItem('userId');
  return new Promise((resolve) => {
    //this.http.get<any>(`${this.apiUrl}/dashboard.php`, {
    this.http.get<any>(`${this.apiUrl}/check-limite.php`, { 
      params: { userId: userId! }
    }).subscribe({
      next: (data) => {
        if (!data) { resolve(false); return; }
        this.projetsActifs   = data.projets_actifs ?? 0;
        this.missionsActives = data.missions_actives ?? 0;
        this.isPremium       = data.is_premium ?? false;
        resolve(true);
      },
      error: () => {
        // En cas d'erreur, bloquer par sécurité
        this.projetsActifs   = 99;
        this.missionsActives = 99;
        resolve(false);
      }
    });
  });
}
}
