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

  categories: Categorie[] = [];

  newProject: any = {
    Nomduprojet: '',
    Publierparentreprise: '',
    Budget: '',
    Duree: '',
    Competences: '',
    Statut: 'en attente',
    id_categorie: null,
    description: '',
  };
  isEditMode: boolean = false;
  projectId: number | null = null;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
     this.newProject.Publierparentreprise = localStorage.getItem('entreprise') || '';
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
    /*this.http
      .get<any>(`${this.apiUrl}/projects.php?projectId=${id}`)*/
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
            Competences: project.Competences || '',
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
     /* this.http
        .put(`${this.projectApiUrl}?id=${this.projectId}`, projectData)*/
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
}
