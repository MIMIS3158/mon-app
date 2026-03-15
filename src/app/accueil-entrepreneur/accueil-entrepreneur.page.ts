/*
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Developer {
  id: number;
  Nomdev: string;
  Prenomdev: string;
  CompetencesTechniques: string[];
}

@Component({
  selector: 'app-accueil-entrepreneur',
  templateUrl: './accueil-entrepreneur.page.html',
  styleUrls: ['./accueil-entrepreneur.page.scss'],
  standalone: false
})
export class AccueilEntrepreneurPage implements OnInit {

  private apiUrl = 'http://localhost:8000/api';

  searchTerm: string = '';
  developers: Developer[] = [];
  filteredDevelopers: Developer[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadDevelopers();
  }

  loadDevelopers() {
    this.http.get<Developer[]>(`${this.apiUrl}/developers`)
      .subscribe({
        next: (developers) => {
          this.developers = developers;
          this.filteredDevelopers = developers;
        },
        error: () => {
          this.developers = [];
          this.filteredDevelopers = [];
        }
      });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    
    if (term === '') {
      this.filteredDevelopers = this.developers;
      return;
    }
    
    this.filteredDevelopers = this.developers.filter(dev => 
      dev.Nomdev.toLowerCase().includes(term) ||
      dev.Prenomdev.toLowerCase().includes(term) ||
      dev.CompetencesTechniques.some(c => c.toLowerCase().includes(term))
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
    this.router.navigate(['/projets'], { 
      queryParams: { statut: 'terminé' } 
    });
  }

  goTo(tab: string) {
    switch(tab) {
      case 'accueil':
        break;
      case 'mes-projets':
        this.router.navigate(['/projets']);
        break;
      case 'profil':
        this.router.navigate(['/profile-entrepreneur']);
        break;
      case 'chat':
        this.router.navigate(['/chat']);
        break;
      case 'signout':
        localStorage.clear();
        this.router.navigate(['/home']);
        break;
    }
  }
}*/
/*
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

}

@Component({
  selector: 'app-accueil-entrepreneur',
  templateUrl: './accueil-entrepreneur.page.html',
  styleUrls: ['./accueil-entrepreneur.page.scss'],
  standalone: false
})
export class AccueilEntrepreneurPage implements OnInit {

 private apiUrl = 'http://localhost:8000/api';

  searchTerm: string = '';
  developers: Developer[] = [];
  filteredDevelopers: Developer[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadDevelopers();
  }

  loadDevelopers() {
    this.http.get<Developer[]>(`${this.apiUrl}/developers`)
      .subscribe({
        next: (developers) => {
          this.developers = developers;
          this.filteredDevelopers = developers;
        },
        error: () => {
          this.developers = [];
          this.filteredDevelopers = [];
        }
      });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    
    if (term === '') {
      this.filteredDevelopers = this.developers;
      return;
    }
    
    this.filteredDevelopers = this.developers.filter(dev => 
  dev.Nomdev.toLowerCase().includes(term) ||
  dev.Prenomdev.toLowerCase().includes(term) ||
  dev.CompetencesTechniques?.toLowerCase().includes(term)
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
    this.router.navigate(['/projets'], { 
      queryParams: { statut: 'terminé' } 
    });
  }
  viewProfile(developer: Developer) {
  this.router.navigate(['/profile-dev', developer.id]);
}
  goTo(tab: string) {
    switch(tab) {
      case 'accueil':
        break;
      case 'mes-projets':
        this.router.navigate(['/projets']);
        break;
      case 'profil':
        this.router.navigate(['/profile-entrepreneur']);
        break;
      case 'chat':
        this.router.navigate(['/chat']);
        break;
      case 'signout':
        localStorage.clear();
        this.router.navigate(['/home']);
        break;
    }
  }
}*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ModalController } from '@ionic/angular'; 
import { ParametresPage } from '../parametres/parametres.page';

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
}

@Component({
  selector: 'app-accueil-entrepreneur',
  templateUrl: './accueil-entrepreneur.page.html',
  styleUrls: ['./accueil-entrepreneur.page.scss'],
  standalone: false
})
export class AccueilEntrepreneurPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';

  searchTerm: string = '';
  developers: Developer[] = [];
  filteredDevelopers: Developer[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    
    private modalController: ModalController 
  ) {}

  ngOnInit() {
    this.loadDevelopers();
  }

 /* loadDevelopers() {

    this.http.get<Developer[]>(`${this.apiUrl}/get_developers.php`)
   // this.http.get<Developer[]>(`${this.apiUrl}/profile_dev.php`)
      .subscribe({
        next: (developers) => {
          this.developers = developers;
          this.filteredDevelopers = developers;
        },
        error: (err) => {
          console.error('Erreur chargement développeurs:', err);
          this.developers = [];
          this.filteredDevelopers = [];
        }
      });
  }*/
 loadDevelopers() {
    this.http.get<Developer[]>(`${this.apiUrl}/get_developers.php`)
        .subscribe({
            next: (developers) => {
                this.developers = developers;
                this.filteredDevelopers = []; 
            }
        });
}

  /*onSearch() {
    const term = this.searchTerm.toLowerCase();
    
    if (term === '') {
      this.filteredDevelopers = this.developers;
      return;
    }
    
    this.filteredDevelopers = this.developers.filter(dev => 
      dev.Nomdev.toLowerCase().includes(term) ||
      dev.Prenomdev.toLowerCase().includes(term) ||
      dev.CompetencesTechniques?.toLowerCase().includes(term)
    );
  }*/
 onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (term === '') {
      this.filteredDevelopers = [];
      return;
    }
    
    this.filteredDevelopers = this.developers.filter(dev => 
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
    this.router.navigate(['/projets'], { 
      queryParams: { statut: 'terminé' } 
    });
  }

/*  viewProfile(developer: Developer) {
    this.router.navigate(['/profile-dev', developer.id]);
  }*/
 viewProfile(developer: Developer) {
    localStorage.setItem('selectedDeveloper', JSON.stringify(developer));
    this.router.navigate(['/profile-dev']);
}
 async ouvrirParametre() {
    const modal = await this.modalController.create({
      component: ParametresPage,
      cssClass: 'settings-modal'
    });
    return await modal.present();
  }

  goTo(tab: string) {
    switch(tab) {
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