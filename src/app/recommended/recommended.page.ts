import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.page.html',
  styleUrls: ['./recommended.page.scss'],
  standalone: false
})
export class RecommendedPage implements OnInit {
  allProjets: any[] = [];
  filteredProjets: any[] = [];
  activeFilter: string = 'all';
  devId: number = parseInt(localStorage.getItem('userId') || '0');
  private apiUrl = 'http://localhost/myApp/api';
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit() {
    if (!this.devId) {
      console.error("Utilisateur non connecté");
      return;
    }
    this.http.get<any>(`${this.apiUrl}/recommended.php?devId=${this.devId}`)
      .subscribe({
        next: (data) => {
          this.allProjets = data || [];
          this.setFilter(this.activeFilter);
        },
        error: (err) => {
          console.error('Erreur API:', err);
          this.allProjets = [];
          this.filteredProjets = [];
        }
      });
  }
  setFilter(filter: string) {
    this.activeFilter = filter;
    if(filter === 'all') {
      this.filteredProjets = this.allProjets; 
    } else if(filter === '80') {
      this.filteredProjets = this.allProjets.filter(p => p.score >= 80);
    } else if(filter === '50') {
      this.filteredProjets = this.allProjets.filter(p => p.score >= 50);
    }
  }
  getBarColor(score: number): string {
    if (score >= 80) return '#639922';  
    if (score >= 50) return '#378ADD';  
    return '#EF9F27';                   
  }
  postuler(projet: any) {
  localStorage.setItem('selectedProject', JSON.stringify({
    id: projet.id,
    Nomduprojet: projet.nom,
    Budget: projet.budget,
    Duree: projet.duree
  }));
  this.router.navigate(['/description']);
}
}