import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.page.html',
  styleUrls: ['./parametres.page.scss'],
  standalone: false
})
export class ParametresPage implements OnInit {
  private apiUrl = environment.apiUrl;
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
    this.profileImage = photo ? `${this.apiUrl}/${photo}` : '';
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
  save() {
    this.modalController.dismiss();
    this.router.navigate(['/sauvegarder']);
  }
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
