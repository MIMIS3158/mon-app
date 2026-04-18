/*import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-publier-projet',
  templateUrl: './publier-projet.page.html',
  styleUrls: ['./publier-projet.page.scss'],
  standalone: false,
})
export class PublierProjetPage implements OnInit {
  Nom: String = '';
  entreprise: string = '';
  Budget: string = '';
  duree: string = '';
  Statut: string = '';
  Description: string = '';

  PublierProjet() {
    const donnees = {
      Nom: this.Nom,
      entreprise: this.entreprise,
      Budget: this.Budget,
      duree: this.duree,
      Statut: this.Statut,
      Description: this.Description,
    };
    console.log('Projet publié : ', donnees);
    this.alertsService.alert('Projet publié avec succès !');
  }
  ModifierProjet() {
    const donnees = {
      Nom: this.Nom,
      entreprise: this.entreprise,
      Budget: this.Budget,
      duree: this.duree,
      Statut: this.Statut,
      Description: this.Description,
    };
    console.log('Projet modifié: ', donnees);
    this.alertsService.alert('Projet modifié avec succès !');
  }
  constructor(private alertsService: AlertsService) {}

  ngOnInit() {}
}*/
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-publier-projet',
  templateUrl: './publier-projet.page.html',
  styleUrls: ['./publier-projet.page.scss'],
  standalone: false,
})
export class PublierProjetPage implements OnInit {
 private apiUrl = environment.apiUrl;
  userName: string = '';
  profileImage: string = '';
  constructor(
    private modalController: ModalController,
    private router: Router,
  ) {}

  ngOnInit() {
    const prenom = localStorage.getItem('prenom') || '';
    const nom = localStorage.getItem('nom') || '';
    this.userName = `${prenom} ${nom}`.trim() || 'Utilisateur';

    /* const photo = localStorage.getItem('profileImage') || '';
    this.profileImage = photo ? `${this.apiUrl}/${photo}` : '';*/
    const photo = localStorage.getItem('profileImage') || '';
    this.profileImage = photo ? `http://localhost:8000/${photo}` : '';
  }

  onImageError(event: any) {
    event.target.src = 'assets/profile_avatar.jpeg';
  }
  ModeSombre() {
    this.modalController.dismiss();
    this.router.navigate(['/dark-mode-settings']);
  }

  close() {
    this.modalController.dismiss();
  }
  openProfile() {
    this.modalController.dismiss();
    this.router.navigate(['/profile-dev']);
  }
  mesEvaluations() {
    this.modalController.dismiss();
    this.router.navigate(['/mes-evaluations']);
  }
  /*
  save() {
    this.modalController.dismiss();
    this.router.navigate(['/sauvegarder']);
  }*/
  aide() {
    this.modalController.dismiss();
    this.router.navigate(['/aide']);
  }
  logout() {
    localStorage.clear();
    this.modalController.dismiss();
    this.router.navigate(['/home']);
  }
}