import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-sauvegarder',
  templateUrl: './sauvegarder.page.html',
  styleUrls: ['./sauvegarder.page.scss'],
  standalone: false,
})
export class SauvegarderPage implements OnInit {
  private apiUrl = environment.apiUrl;

  projets: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadSavedProjects();
  }

 
/*
  async loadSavedProjects() {
  const userId = localStorage.getItem('userId');
  try {
    const projets = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/favorites.php`, {
        params: { id_developpeur: userId! }
      })
    );
    this.projets = projets;
  } catch(err) {}
}*/
async loadSavedProjects() {
  const userId = localStorage.getItem('userId');
  try {
    const items = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/favorites.php`, {
        params: { id_developpeur: userId!, type: 'details' }
      })
    );
    this.projets = items;
  } catch(err) {}
}
 
async supprimerFavori(projetId: number) {
  const userId = localStorage.getItem('userId');
  try {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/favorites.php`, {
        params: { id: projetId, id_developpeur: userId! }
      })
    );
    this.loadSavedProjects();
  } catch(err) {}
}


  ouvrirProjet(projet: any) {
    localStorage.setItem('selectedProject', JSON.stringify(projet));
    this.router.navigate(['/description']);
  }
  /* retour() {
    history.back();
  }*/
}
