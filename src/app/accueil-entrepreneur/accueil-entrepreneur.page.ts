import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ModalController } from '@ionic/angular';
import { ParametresPage } from '../parametres/parametres.page';
import { environment } from 'src/environments/environment';

interface Developer {
  id: number;
  Nomdev: string;
  Prenomdev: string;
  CompetencesTechniques: string;
  Experience?: number;
  Niveau?: string;
  Disponibilite?: string;
  Ville?: string;
  Pays?: string;
  Github?: string;
  TarifJournalier?: number;
  Portfolio?: string;
  moyenneNote?: number;
}

@Component({
  selector: 'app-accueil-entrepreneur',
  templateUrl: './accueil-entrepreneur.page.html',
  styleUrls: ['./accueil-entrepreneur.page.scss'],
  standalone: false
})
export class AccueilEntrepreneurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  searchTerm: string = '';
  developers: Developer[] = [];
  filteredDevelopers: Developer[] = [];
  enCoursCount: number = 0;
  terminesCount: number = 0;
  messagesNonLus: number = 0;
  notificationsCount: number = 0;
  private badgeInterval: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadDevelopers();
    this.loadBadges();
    this.badgeInterval = setInterval(() => this.loadBadges(), 5000);
  }
  loadDevelopers() {
    this.http.get<Developer[]>(`${this.apiUrl}/get_developers.php`).subscribe({
      next: developers => {
        this.developers = developers;
        this.filteredDevelopers = [];
      }
    });
  }
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();

    if (term === '') {
      this.filteredDevelopers = [];
      return;
    }

    this.filteredDevelopers = this.developers.filter(
      dev =>
        (dev.Nomdev?.toLowerCase() || '').includes(term) ||
        (dev.Prenomdev?.toLowerCase() || '').includes(term) ||
        (dev.CompetencesTechniques?.toLowerCase() || '').includes(term)
    );
  }
  goToMesProjets() {
    this.router.navigate(['/projets']);
  }
  goToPostulations() {
    this.router.navigate(['/notification']);
  }
  goToEnCours() {
    this.router.navigate(['/projets'], {
      queryParams: { statut: 'en cours' }
    });
  }
  goToTermines() {
    this.router.navigate(['/notification'], {
      queryParams: { statut: 'terminé' }
    });
  }
  viewProfile(developer: Developer) {
    localStorage.setItem('selectedDeveloper', JSON.stringify(developer));
    this.router.navigate(['/profile-dev']);
  }
  async openSettings() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal'
    });
    return await modal.present();
  }
  getStars(note: number | undefined): string[] {
    const stars: string[] = [];
    const n = note || 0;
    for (let i = 1; i <= 5; i++) {
      if (n >= i) stars.push('full');
      else if (n >= i - 0.5) stars.push('half');
      else stars.push('empty');
    }
    return stars;
  }

  loadBadges() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    this.http
      .get<any>(`${this.apiUrl}/badge.php?userId=${userId}&role=${role}`)
      .subscribe({
        next: data => {
          this.messagesNonLus = data.messages;
          this.notificationsCount = data.notifications;
          this.enCoursCount = data.en_cours;
          this.terminesCount = data.termines;
        },
        error: () => {}
      });
  }
  ionViewWillLeave() {
    if (this.badgeInterval) clearInterval(this.badgeInterval);
  }

  goTo(tab: string) {
    switch (tab) {
      case 'accueil':
        break;
      case 'mes-projets':
        this.router.navigate(['/projets']);
        break;
      case 'profil':
        this.router.navigate(['/profile-entrepreneur']);
        break;
      case 'conversations':
        this.router.navigate(['/conversations']);
        break;
      case 'dashboard':
        this.router.navigate(['/dashboard-entrepreneur']);
        break;
      /*case 'signout':
        localStorage.clear();
        this.router.navigate(['/home']);
        break;*/
      case 'parametres':
        this.router.navigate(['/parametres']);
        break;
    }
  }
}
