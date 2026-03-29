import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-mes-evaluations',
  templateUrl: './mes-evaluations.page.html',
  styleUrls: ['./mes-evaluations.page.scss'],
  standalone: false,
})
export class MesEvaluationsPage implements OnInit {
  private apiUrl = environment.apiUrl;

  evaluations: any[] = [];
  moyenneNote: number = 0;
  totalAvis: number = 0;
  type: string = 'developpeur';
  idEvalue: number | null = null;
  avisPositifs: number = 0;
  avisNegatifs: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.type = nav.extras.state['type'] || 'developpeur';
      this.idEvalue = nav.extras.state['idEvalue'] || null;
    }
  }
  ngOnInit() {}
  ionViewWillEnter() {
    if (!this.idEvalue) {
      const role = localStorage.getItem('role');
      if (role === 'developer') {
        this.type = 'developeur';
      } else {
        this.type = 'entrepreneur';
      }
    }
    this.loadEvaluations();
  }
 
 /*loadEvaluations() {
  const userId = localStorage.getItem('userId');
  
  const params: any = { type: this.type };
  if (this.idEvalue) {
    params['id_evalue'] = this.idEvalue;
  } else {
    params['userId'] = userId;
  }

  this.http.get<any[]>(`${this.apiUrl}/get_evaluations.php`, { params })
    .subscribe((evals) => {
      this.evaluations = evals;
      this.totalAvis = evals.length;
      if (evals.length > 0) {
        const total = evals.reduce((sum, e) => sum + Number(e.note), 0);
        this.moyenneNote = total / evals.length;
        this.avisPositifs = evals.filter((e) => e.note >= 4).length;
        this.avisNegatifs = evals.filter((e) => e.note <= 2).length;
      }
    });
}*/
async loadEvaluations() {
  const userId = localStorage.getItem('userId');
  const params: any = { type: this.type };
  if (this.idEvalue) {
    params['id_evalue'] = this.idEvalue;
  } else {
    params['userId'] = userId;
  }
  try {
    const evals = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/get_evaluations.php`, { params })
    );
    this.evaluations = evals;
    this.totalAvis = evals.length;
    if (evals.length > 0) {
      const total = evals.reduce((sum, e) => sum + Number(e.note), 0);
      this.moyenneNote = total / evals.length;
      this.avisPositifs = evals.filter(e => e.note >= 4).length;
      this.avisNegatifs = evals.filter(e => e.note <= 2).length;
    }
  } catch(err) {}
}
  /* retour() {
    history.back();
  }*/
}
