/*import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-entrepreneur',
  templateUrl: './dashboard-entrepreneur.page.html',
  styleUrls: ['./dashboard-entrepreneur.page.scss'],
  standalone: false,
})
export class DashboardEntrepreneurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  interesses: number = 0;
  matchingDevs: number = 0;
  totalDevs: number = 0;
  competences: any[] = [];
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }
  ionViewWillEnter() {
    this.loadDashboard();
  }
  loadDashboard() {
    const userId = localStorage.getItem('userId');
    this.isLoading = true;*/
   /* this.http
      .get<any>(`${this.apiUrl}/dashboard.php?userId=${userId}`)*/
    /*  this.http.get<any>(`${this.apiUrl}/dashboard.php`, {
  params: { userId: userId! }
})
      .subscribe({
        next: (data) => {
          this.interesses = data.interesses;
          this.matchingDevs = data.matching_devs;
          this.totalDevs = data.total_devs;
          this.competences = data.competences;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
 
}*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-entrepreneur',
  templateUrl: './dashboard-entrepreneur.page.html',
  styleUrls: ['./dashboard-entrepreneur.page.scss'],
  standalone: false,
})
export class DashboardEntrepreneurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  interesses: number = 0;
  matchingDevs: number = 0;
  totalDevs: number = 0;
  totalProjets: number = 0;
  missionsTerminees: number = 0;
  competences: any[] = [];
  isLoading: boolean = true;
  userName: string = '';
// Ajoute ces variables
limiteProjets: number = 3;
projetsActifs: number = 0;
missionsActives: number = 0;
totalPublications: number = 0;
isPremium: boolean = false;    // plan premium ou non
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() { this.loadDashboard(); }
  ionViewWillEnter() { this.loadDashboard(); }

  loadDashboard() {
    const userId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName') || 'Entrepreneur';
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/dashboard.php`, { params: { userId: userId! } })
      .subscribe({
        next: (data) => {
          this.interesses = data.interesses;
          this.matchingDevs = data.matching_devs;
          this.totalDevs = data.total_devs;
          this.totalProjets = data.total_projets;
          this.missionsTerminees = data.missions_terminees;
          this.competences = data.competences;
          this.isLoading = false;
         this.projetsActifs = data.projets_actifs ?? data.total_projets;
this.missionsActives = data.missions_actives ?? 0;
//this.totalPublications = this.projetsActifs + this.missionsActives;
this.totalPublications = this.projetsActifs + this.missionsActives;
this.limiteProjets = 6; // 3 projets + 3 missions = 6 total
this.isPremium = data.is_premium ?? false;
        },
        error: () => { this.isLoading = false; }
      });
  }
}