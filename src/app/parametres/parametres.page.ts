import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.page.html',
  styleUrls: ['./parametres.page.scss'],
  standalone: false
})
export class ParametresPage implements OnInit {

  userName: string = '';
  profileImage: string = '';


  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {

    const prenom = localStorage.getItem('prenom') || '';
    const nom = localStorage.getItem('nom') || '';
    this.userName = `${prenom} ${nom}`.trim() || 'Utilisateur';

    const photo = localStorage.getItem('profileImage') || '';
    this.profileImage = photo ? `http://localhost/myApp/api/${photo}` : '';
  }

  onImageError(event: any) {
    event.target.src = 'assets/téléchargement (10).jpeg';
  }
ModeSombre() {
  this.modalController.dismiss();
  this.router.navigate(['/dark-mode-settings']);
}

  fermer() { this.modalController.dismiss(); }
  voirProfil() { this.modalController.dismiss(); this.router.navigate(['/profile-dev']); }
  mesEvaluations() { this.modalController.dismiss(); this.router.navigate(['/mes-evaluations']); }
  sauvegarder() { this.modalController.dismiss(); this.router.navigate(['/sauvegarder']); }
  aide() { this.modalController.dismiss(); this.router.navigate(['/aide']); }
  logout() { localStorage.clear(); this.modalController.dismiss(); this.router.navigate(['/home']); }
}