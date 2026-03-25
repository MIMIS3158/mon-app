import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-profile-entrepreneur',
  templateUrl: './profile-entrepreneur.page.html',
  styleUrls: ['./profile-entrepreneur.page.scss'],
  standalone: false
})
export class ProfileEntrepreneurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  evaluations: any[] = [];
  moyenneNote: number = 0;
  Nom: string = '';
  Prenom: string = '';
  Email: string = '';

  Telephone: string = '';
  Secteur: string = '';
  Entreprise: string = '';
  Description: string = '';
  profileImage: string = 'assets/profile_avatar.jpeg';
  profileImageFile: File | null = null;
  DateNaissance: string = '';
  Pays: string = '';
  Ville: string = '';
  SiteWeb: string = '';
  Linkedin: string = '';
  TailleEntreprise: string = '';
  AnneeCreation: string = '';
  BudgetMoyen: string = '';

  @ViewChild('fileInput', { static: false }) fileInput: any;

  constructor(private http: HttpClient, private alertsService: AlertsService) {}

  ngOnInit() {
    this.chargerProfil();
    this.loadEvaluations();
  }

  chargerProfil() {
    this.http
      .get<any>(
        `${this.apiUrl}/profile_entrepreneur.php?userId=${localStorage.getItem(
          'userId'
        )}`
      )
      .subscribe({
        next: profile => {
          this.Nom = profile.Nom || '';
          this.Prenom = profile.Prenom || '';

          this.Email = profile.Email || '';
          this.Telephone = profile.Telephone || '';
          this.Secteur = profile.Secteur || '';
          this.Entreprise = profile.Entreprise || '';
          this.Description = profile.Description || '';
          this.profileImage =
            profile.profileImage || 'assets/profile_avatar.jpeg';
          this.DateNaissance = profile.DateNaissance || '';
          this.Pays = profile.Pays || '';
          this.Ville = profile.Ville || '';
          this.SiteWeb = profile.SiteWeb || '';
          this.Linkedin = profile.Linkedin || '';
          this.TailleEntreprise = profile.TailleEntreprise || '';
          this.AnneeCreation = profile.AnneeCreation || '';
          this.BudgetMoyen = profile.BudgetMoyen || '';
        },
        error: () => {}
      });
  }

  enregistrerProfil() {
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('user_id', localStorage.getItem('userId') || '');
    formData.append('Nom', this.Nom);
    formData.append('Prenom', this.Prenom);

    formData.append('Email', this.Email);
    formData.append('Telephone', this.Telephone);
    formData.append('Secteur', this.Secteur);
    formData.append('Entreprise', this.Entreprise);
    formData.append('Description', this.Description);
    formData.append('DateNaissance', this.DateNaissance);
    formData.append('Pays', this.Pays);
    formData.append('Ville', this.Ville);
    formData.append('SiteWeb', this.SiteWeb);
    formData.append('Linkedin', this.Linkedin);
    formData.append('TailleEntreprise', this.TailleEntreprise);
    formData.append('AnneeCreation', this.AnneeCreation);
    formData.append('BudgetMoyen', this.BudgetMoyen);
    console.log(' Enregistrement en cours...');

    this.alertsService.alert(' PROFIL ENREGISTRÉ !');

    if (this.profileImageFile) {
      formData.append('profileImage', this.profileImageFile);
    }

    this.http
      .post(`${this.apiUrl}/profile_entrepreneur.php`, formData)
      .subscribe({
        next: () => {
          this.chargerProfil();
        },
        error: () => {}
      });
  }

  ModifierProfil() {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('user_id', localStorage.getItem('userId') || '');
    formData.append('Nom', this.Nom);
    formData.append('Prenom', this.Prenom);

    formData.append('Email', this.Email);
    formData.append('Telephone', this.Telephone);
    formData.append('Secteur', this.Secteur);
    formData.append('Entreprise', this.Entreprise);
    formData.append('Description', this.Description);
    formData.append('DateNaissance', this.DateNaissance);
    formData.append('Pays', this.Pays);
    formData.append('Ville', this.Ville);
    formData.append('SiteWeb', this.SiteWeb);
    formData.append('Linkedin', this.Linkedin);
    formData.append('TailleEntreprise', this.TailleEntreprise);
    formData.append('AnneeCreation', this.AnneeCreation);
    formData.append('BudgetMoyen', this.BudgetMoyen);

    if (this.profileImageFile) {
      formData.append('profileImage', this.profileImageFile);
    }
    this.http
      .post(`${this.apiUrl}/profile_entrepreneur.php`, formData)
      .subscribe({
        next: (response: any) => {
          console.log(' Profil modifié avec succès !', response);
          this.alertsService.alert(' PROFIL MODIFIÉ !');
          this.chargerProfil();
        },
        error: (err: any) => {
          console.error(' Erreur modification:', err);
        }
      });
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }
  loadEvaluations() {
    const userId = localStorage.getItem('userId');
    this.http
      .get<any[]>(
        `${this.apiUrl}/get_evaluations.php?type=entrepreneur&userId=${userId}`
      )
      .subscribe({
        next: evals => {
          this.evaluations = evals;
          if (evals.length > 0) {
            const total = evals.reduce((sum, e) => sum + e.note, 0);
            this.moyenneNote = total / evals.length;
          }
        },
        error: () => {}
      });
  }
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.profileImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
