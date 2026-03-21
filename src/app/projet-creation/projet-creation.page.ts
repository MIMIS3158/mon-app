import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';


interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  description: string;
}

@Component({
  selector: 'app-projet-creation',
  templateUrl: './projet-creation.page.html',
  styleUrls: ['./projet-creation.page.scss'],
  standalone: false
})
export class ProjetCreationPage implements OnInit {

 private apiUrl = 'http://localhost/myApp/api/project.php';
private categoriesUrl = 'http://localhost/myApp/api/categories.php';

  categories: Categorie[] = [];

newProject: any = {
    Nomduprojet: '',
    Publierparentreprise: '',
    Budget: '',
    Duree: '',
    Competences: '',
    Statut: 'en attente',
    id_categorie: null,
    Descriptionduprojet: ''
}; 
isEditMode: boolean = false;
projectId: number | null = null;
  constructor(
    private http: HttpClient,
    private router: Router,
     private route: ActivatedRoute  
  ) { }

  ngOnInit() {

    this.loadCategories();
    this.route.queryParams.subscribe(params => {
    if (params['id']) {
        this.isEditMode = true;
        this.projectId = params['id'];
        this.loadProject(this.projectId);
    }
});
  }
loadProject(id: any) {
    this.http.get<any>(`http://localhost/myApp/api/projects.php?projectId=${id}`)
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
                    Descriptionduprojet: project.Descriptionduprojet || ''
                };
            },
            error: () => {}
        });
}
  loadCategories() {
    this.http.get<Categorie[]>(this.categoriesUrl)
    .subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories chargées :', this.categories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories :', error);
        alert('Impossible de charger les catégories');
      }
    });
  }
addProject() {
  if (!this.isValid()) return;
  const projectData = {
    ...this.newProject,
    user_id: localStorage.getItem('userId')
  };
  if (this.isEditMode && this.projectId) {
    this.http.put(`${this.apiUrl}?id=${this.projectId}`, projectData)
      .subscribe({
        next: () => {
          alert('Projet modifié avec succès !');
          this.router.navigate(['/projets']);
        },
        error: (err) => {
          console.error('Erreur lors de la modification :', err);
          const message = err.error?.error || 'Erreur inconnue';
          alert('Erreur lors de la modification : ' + message);
        }
      });
  } else {
    this.http.post(this.apiUrl, projectData)
      .subscribe({
        next: () => {
          alert('Projet publié avec succès !');
          this.router.navigate(['/accueil-entrepreneur']);
        },
        error: (err) => {
          console.error('Erreur lors de la publication :', err);
          const message = err.error?.error || 'Erreur inconnue';
          alert('Erreur lors de la publication : ' + message);
        }
      });
  }
}
 isValid(): boolean {
    if (!this.newProject.Nomduprojet?.trim()) {
        alert('Le nom du projet est requis');
        return false;
    }
    if (!this.newProject.Budget) {
        alert('Le budget est requis');
        return false;
    }
    if (!this.newProject.id_categorie) {
        alert('Veuillez sélectionner une catégorie');
        return false;
    }
    return true;
}
}
   