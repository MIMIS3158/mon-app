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
  darkMode: boolean = false;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || 'Utilisateur';
    this.profileImage = localStorage.getItem('profileImage') || '';
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', this.darkMode);
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('darkMode', String(this.darkMode));
  }

  fermer() { this.modalController.dismiss(); }
  voirProfil() { this.modalController.dismiss(); this.router.navigate(['/profile-dev']); }
  mesEvaluations() { this.modalController.dismiss(); this.router.navigate(['/mes-evaluations']); }
  sauvegarder() { this.modalController.dismiss(); this.router.navigate(['/sauvegarder']); }
  aide() { this.modalController.dismiss(); this.router.navigate(['/aide']); }
  logout() { localStorage.clear(); this.modalController.dismiss(); this.router.navigate(['/home']); }
}