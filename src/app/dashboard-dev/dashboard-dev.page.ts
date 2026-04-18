/*import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-dev',
  templateUrl: './dashboard-dev.page.html',
  styleUrls: ['./dashboard-dev.page.scss'],
  standalone: false,
})
export class DashboardDevPage implements OnInit {
  private apiUrl = environment.apiUrl;
  loading = true;

  stats = {
    total: 0,
    terminees: 0,
    refusees: 0,
    encours: 0,
    moyenne: 0,
    total_evals: 0
  };

  niveau: string = 'Junior';
  niveauPct: number = 0;
  niveauMsg: string = '';
  stars: boolean[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/dashboard_dev.php`, {
        params: { userId }
      })
    ).then((data) => {
      this.stats = data;
      this.calculerNiveau(data.terminees);
      this.calculerStars(data.moyenne);
      this.loading = false;
    }).catch(err => console.error('Erreur dashboard:', err));
  }

  calculerNiveau(terminees: number) {
    if (terminees >= 10) {
      this.niveau = 'Senior';
      this.niveauPct = 100;
      this.niveauMsg = 'Niveau maximum atteint !';
    } else if (terminees >= 4) {
      this.niveau = 'Intermédiaire';
      this.niveauPct = Math.round(30 + (terminees - 4) / 6 * 40);
      this.niveauMsg = `Encore ${10 - terminees} mission(s) pour devenir Senior`;
    } else {
      this.niveau = 'Junior';
      this.niveauPct = Math.round(terminees / 4 * 30);
      this.niveauMsg = `Encore ${4 - terminees} mission(s) pour passer Intermédiaire`;
    }
  }

  calculerStars(moyenne: number) {
    this.stars = Array.from({ length: 5 }, (_, i) => i < Math.round(moyenne));
  }

  getNiveauColor(): string {
    if (this.niveau === 'Senior') return 'success';
    if (this.niveau === 'Intermédiaire') return 'secondary';
    return 'primary';
  }
}*/
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-dev',
  templateUrl: './dashboard-dev.page.html',
  styleUrls: ['./dashboard-dev.page.scss'],
  standalone: false,
})
export class DashboardDevPage implements OnInit {
  private apiUrl = environment.apiUrl;
  loading = true;
  errorMsg = '';

  stats = {
    total: 0,
    terminees: 0,
    refusees: 0,
    encours: 0,
    moyenne: 0,
    total_evals: 0
  };

  niveau = 'Junior';
  niveauPct = 0;
  niveauMsg = '';
  stars: boolean[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.errorMsg = 'Utilisateur non connecté';
      this.loading = false;
      return;
    }

    try {
      const data = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/dashboard_dev.php`, {
          params: { userId }
        })
      );
      
      console.log('📊 DONNÉES REÇUES:', data); // DEBUG

      if (data.error) {
        this.errorMsg = data.error;
        this.loading = false;
        return;
      }

      // Remplir les stats
      this.stats = {
        total: parseInt(data.total) || 0,
        terminees: parseInt(data.terminees) || 0,
        refusees: parseInt(data.refusees) || 0,
        encours: parseInt(data.encours) || 0,
        moyenne: parseFloat(data.moyenne) || 0,
        total_evals: parseInt(data.total_evals) || 0
      };
      
      // ← UTILISER LE NIVEAU DE LA BDD !
      this.niveau = data.niveau || 'Junior';
      this.calculerNiveauBarre(this.niveau);
      this.calculerStars(this.stats.moyenne);
      
    } catch (err: any) {
      console.error('❌ ERREUR:', err);
      this.errorMsg = 'Erreur de chargement';
    } finally {
      this.loading = false;
    }
  }

  // Calcule seulement la barre de progression, pas le niveau
  calculerNiveauBarre(niveau: string) {
    switch(niveau) {
      case 'Senior':
        this.niveauPct = 100;
        this.niveauMsg = 'Niveau maximum atteint ! 🎉';
        break;
      case 'Intermédiaire':
        this.niveauPct = 65;
        this.niveauMsg = 'Continuez pour atteindre Senior !';
        break;
      default: // Junior
        this.niveauPct = 30;
        this.niveauMsg = 'Encore quelques missions pour monter !';
    }
  }

  calculerStars(moyenne: number) {
    const m = parseFloat(String(moyenne)) || 0;
    const rounded = Math.round(m);
    this.stars = Array.from({ length: 5 }, (_, i) => i < rounded);
  }

  getNiveauColor(): string {
    switch (this.niveau) {
      case 'Senior': return 'success';
      case 'Intermédiaire': return 'warning';
      default: return 'primary';
    }
  }
}