/*import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

export interface Project {
  id?: number;
  Nomduprojet: string;
  Publierparentreprise: string;
  Budget: '';
  Duree: string;
  Competences: string;
  Statut: string;
  description: string;
  DatePublication?: Date | string;
}


@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
  standalone: false,
})
export class DescriptionPage implements OnInit {
  private apiUrl = environment.apiUrl;

  messagePostulation: string = '';
  Budget?: number;
  Duree?: string;
  mesProjects: Project[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService,
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
      this.alertsService.alert('Veuillez écrire un message !');
      return;
    }
    const id_developpeur = localStorage.getItem('userId');
    const candidature = {
      project_id: project.id,
      message: this.messagePostulation,
      budget_propose: this.Budget,
      duree_estimee: this.Duree,
      id_developpeur: id_developpeur,
    };
    this.http.post(`${this.apiUrl}/candidature.php`, candidature).subscribe({
      next: () => {
        this.alertsService.alert('Candidature envoyée avec succès !');
        localStorage.removeItem('selectedProject');
        this.router.navigate(['/postulation']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.alertsService.alert('Vous avez déjà postulé à ce projet !');
        } else {
          this.alertsService.alert("Erreur lors de l'envoi !");
        }
      },
    });
  }
  goBack() {
    this.router.navigate(['/accueil-developpeur']);
  }
}
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

export interface Project {
  id?: number;
  Nomduprojet: string;
  Publierparentreprise: string;
  Budget: '';
  Duree: string;
  Competences: string;
  nom_categorie: string;
  Statut: string;
  Descriptionduprojet: string;
  DatePublication?: Date | string;
}

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
  standalone: false,
})
export class DescriptionPage implements OnInit {
  private apiUrl = environment.apiUrl;

  messagePostulation: string = '';
  Budget?: number;
  Duree?: string;
  mesProjects: Project[] = [];
  mission: any = null;        // ← ICI dans la classe
  isMission: boolean = false; // ← ICI dans la classe

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    const missionData = localStorage.getItem('selectedMission');
    const projectData = localStorage.getItem('selectedProject');

    if (missionData) {
      this.mission = JSON.parse(missionData);
      this.isMission = true;
    } else if (projectData) {
      const project = JSON.parse(projectData);
      this.mesProjects = [project];
    } else {
      this.router.navigate(['/accueil-developpeur']);
    }
  }

  onApply(project: Project) {
    if (!this.messagePostulation || this.messagePostulation.trim() === '') {
      this.alertsService.alert('Veuillez écrire un message !');
      return;
    }
    const candidature = {
      project_id: project.id,
      message: this.messagePostulation,
      budget_propose: this.Budget,
      duree_estimee: this.Duree,
      id_developpeur: localStorage.getItem('userId'),
    };
    this.http.post(`${this.apiUrl}/candidature.php`, candidature).subscribe({
      next: () => {
        this.alertsService.alert('Candidature envoyée avec succès !');
        localStorage.removeItem('selectedProject');
        this.router.navigate(['/postulation']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.alertsService.alert('Vous avez déjà postulé à ce projet !');
        } else {
          this.alertsService.alert("Erreur lors de l'envoi !");
        }
      },
    });
  }

  onApplyMission() {
    if (!this.messagePostulation?.trim()) {
      this.alertsService.alert('Veuillez écrire un message !');
      return;
    }
    const candidature = {
      mission_id: this.mission.id,
      project_id: null,
      message: this.messagePostulation,
      budget_propose: this.Budget,
      duree_estimee: this.Duree,
      id_developpeur: localStorage.getItem('userId'),
    };
    this.http.post(`${this.apiUrl}/candidature.php`, candidature).subscribe({
      next: () => {
        this.alertsService.alert('Candidature envoyée avec succès !');
        localStorage.removeItem('selectedMission');
        this.router.navigate(['/postulation']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.alertsService.alert('Vous avez déjà postulé à cette mission !');
        } else {
          this.alertsService.alert("Erreur lors de l'envoi !");
        }
      },
    });
  }

  goBack() {
    this.router.navigate(['/accueil-developpeur']);
  }
}