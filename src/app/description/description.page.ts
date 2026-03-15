/*import { Component, OnInit } from '@angular/core';
import { CandidatureService } from '../services/candidature.service';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
  standalone: false
})
export class DescriptionPage implements OnInit {
  messagePostulation: string = '';
  Budget?: number;
  duree?: string;
  mesProjects: any[] = [];
  constructor(
    private router: Router, private candidatureService: CandidatureService,private projectService: ProjectService
  ) { }*/
 // ngOnInit() {
    //this.projectService.getProjects().subscribe((projects: any[]) => {
     // this.mesProjects = projects;
    //});
  //}
  
 
   /* this.candidatureService.postuler(candidature).subscribe({
      next: () => {
        alert('Candidature envoyée avec succès');
        this.messagePostulation = '';
        this.Budget = undefined;
        this.duree = undefined;
      },
      error: () => {
        alert('Erreur lors de l’envoi');
      }
    });*/import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Project {
  id?: number;
  Nomduprojet: string;
  Publierparentreprise: string;
  Budget: '';
  Duree: string;
  Competences: string; 
  Statut: string;
  Descriptionduprojet: string;
  DatePublication?: Date | string;
}

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
  standalone: false
})
export class DescriptionPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';

  messagePostulation: string = '';
  Budget?: number;
  Duree?: string;
  mesProjects: Project[] = [];
  
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    const projectData = localStorage.getItem('selectedProject');
    if (projectData) {
      const project = JSON.parse(projectData);
      this.mesProjects = [project];
    } else {
      this.router.navigate(['/accueil-developpeur']);
    }
  }
  
  onApply(project: Project) {
    if (!this.messagePostulation || this.messagePostulation.trim() === '') {
        alert('Veuillez écrire un message !');
        return;
    }
    
    const id_developpeur = localStorage.getItem('userId');

    const candidature = {
        project_id: project.id,
        message: this.messagePostulation,
        budget_propose: this.Budget,
        duree_estimee: this.Duree,
        id_developpeur: id_developpeur
    };

    this.http.post(`${this.apiUrl}/candidature.php`, candidature)
        .subscribe({
            next: () => {
                alert('Candidature envoyée avec succès !');
                localStorage.removeItem('selectedProject');
                this.router.navigate(['/postulation']);
            },
            error: (err) => {
                if (err.status === 409) {
                    alert('Vous avez déjà postulé à ce projet !');
                } else {
                    alert('Erreur lors de l\'envoi !');
                }
            }
        });
  }

  goBack() {
    this.router.navigate(['/accueil-developpeur']);
  }
}