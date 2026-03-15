import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publier-projet',
  templateUrl: './publier-projet.page.html',
  styleUrls: ['./publier-projet.page.scss'],
  standalone: false
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
    
  }
  console.log('Projet publié : ' , donnees);
   alert('Projet publié avec succès !');
  }
 ModifierProjet() {
  const donnees = {
     Nom: this.Nom,
    entreprise: this.entreprise,
    Budget: this.Budget,
    duree: this.duree,
    Statut: this.Statut,
    Description: this.Description,
  }
    console.log('Projet modifié: ' , donnees);
   alert('Projet modifié avec succès !');
  }
  constructor() { }

  ngOnInit() {
  }

}
