import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sauvegarder',
  templateUrl: './sauvegarder.page.html',
  styleUrls: ['./sauvegarder.page.scss'],
  standalone: false
})
export class SauvegarderPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';
  projets: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadSavedProjects();
  }

  loadSavedProjects() {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`${this.apiUrl}/favorites.php?id_developpeur=${userId}`)
      .subscribe({
        next: (projets) => {
          this.projets = projets;
        },
        error: () => {}
      });
  }

  supprimerFavori(projetId: number) {
    const userId = localStorage.getItem('userId');
    this.http.delete(`${this.apiUrl}/favorites.php?id=${projetId}&id_developpeur=${userId}`)
      .subscribe({
        next: () => {
          this.loadSavedProjects();
        },
        error: () => {}
      });
  }

  ouvrirProjet(projet: any) {
    localStorage.setItem('selectedProject', JSON.stringify(projet));
    this.router.navigate(['/description']);
  }

  retour() {
    history.back();
  }
}