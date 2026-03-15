import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mes-evaluations',
  templateUrl: './mes-evaluations.page.html',
  styleUrls: ['./mes-evaluations.page.scss'],
  standalone: false
})
export class MesEvaluationsPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';

  evaluations: any[] = [];
  moyenneNote: number = 0;
  totalAvis: number = 0;
  type: string = 'developpeur';
  idEvalue: number | null = null;
  avisPositifs:number = 0;
avisNegatifs:number = 0;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.type = nav.extras.state['type'] || 'developpeur';
      this.idEvalue = nav.extras.state['idEvalue'] || null;
    }
  }

  ngOnInit() {}

  /*ionViewWillEnter() {
    if (!this.type) {
      const role = localStorage.getItem('role');
      this.type = role === 'developer' ? 'developpeur' : 'entrepreneur';
    }
    this.loadEvaluations();
  }*/
 ionViewWillEnter() {
  const role = localStorage.getItem('role');

  if(role === 'developer'){
    this.type = 'developpeur';
  }else{
    this.type = 'entrepreneur';
  }

  this.loadEvaluations();
}
/*
  loadEvaluations() {
    const userId = localStorage.getItem('userId');
    const url = this.idEvalue
      ? `${this.apiUrl}/get_evaluations.php?type=${this.type}&id_evalue=${this.idEvalue}`
      : `${this.apiUrl}/get_evaluations.php?type=${this.type}&userId=${userId}`;

    this.http.get<any[]>(url).subscribe({
      next: (evals) => {
        this.evaluations = evals;
        this.totalAvis = evals.length;
        if (evals.length > 0) {
          const total = evals.reduce((sum, e) => sum + Number(e.note), 0);
          this.moyenneNote = total / evals.length;
        }
      },
      error: () => {}
    });
  }*/


    loadEvaluations() {

const userId = localStorage.getItem('userId');

const url = this.idEvalue
  ? `${this.apiUrl}/get_evaluations.php?type=${this.type}&id_evalue=${this.idEvalue}`
  : `${this.apiUrl}/get_evaluations.php?type=${this.type}&userId=${userId}`;

this.http.get<any[]>(url).subscribe(evals => {

this.evaluations = evals;

this.totalAvis = evals.length;

if(evals.length>0){

const total = evals.reduce((sum,e)=>sum+Number(e.note),0);

this.moyenneNote = total/evals.length;

this.avisPositifs = evals.filter(e=>e.note>=4).length;

this.avisNegatifs = evals.filter(e=>e.note<=2).length;

}

});
}

  retour() {
    history.back();
  }
}