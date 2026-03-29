import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.page.html',
  styleUrls: ['./evaluation.page.scss'],
  standalone: false,
})
export class EvaluationPage implements OnInit {
  private apiUrl = environment.apiUrl;

  projet: any = null;
  idEvalue: number = 0;
  type: 'developpeur' | 'entrepreneur' = 'developpeur';
  note: number = 0;
  commentaire: string = '';
  avisType: 'positif' | 'negatif' | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.projet = navigation.extras.state['projet'];
      this.type = navigation.extras.state['type'];

      if (this.type === 'developpeur') {
        this.idEvalue = navigation.extras.state['entrepreneurId'];
      } else {
        this.idEvalue = navigation.extras.state['developpeurId'];
      }
    }
  }

  ngOnInit() {
    if (!this.projet || !this.idEvalue) {
      this.presentToast('Erreur : données manquantes', 'danger');
      this.goBack();
    }
  }

  get typeEvalue(): string {
    return this.type === 'developpeur' ? "l'entrepreneur" : 'le développeur';
  }

  getNoteText(): string {
    switch (this.note) {
      case 1:
        return 'Très insatisfait';
      case 2:
        return 'Insatisfait';
      case 3:
        return 'Moyen';
      case 4:
        return 'Satisfait';
      case 5:
        return 'Excellent !';
      default:
        return 'Sélectionnez une note';
    }
  }

  async publierAvis() {
    if (!this.note || !this.commentaire.trim() || !this.avisType) {
      this.presentToast('Veuillez remplir tous les champs', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmer',
      message: 'Êtes-vous sûr de vouloir publier cet avis ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Publier',
          handler: () => {
            this.envoyerEvaluation();
          },
        },
      ],
    });
    await alert.present();
  }

  envoyerEvaluation() {
    const evaluationData = {
      id_projet: this.projet.id || this.projet.project_id,
      id_evalue: this.idEvalue,
      type_evaluateur: this.type,
      note: this.note,
      commentaire: this.commentaire,
      avis_type: this.avisType,
      user_id: localStorage.getItem('userId'),
    };

    this.http
      .post(`${this.apiUrl}/add_evaluation.php`, evaluationData)
      .subscribe({
        next: (response: any) => {
          this.presentToast('Évaluation publiée avec succès !', 'success');

          if (this.type === 'developpeur') {
            this.router.navigate(['/postulation']);
          } else {
            this.router.navigate(['/notification']);
          }
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.presentToast('Erreur lors de la publication', 'danger');
        },
      });
  }

  goBack() {
    if (this.type === 'developpeur') {
      this.router.navigate(['/postulation']);
    } else {
      this.router.navigate(['/notification']);
    }
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }
}
