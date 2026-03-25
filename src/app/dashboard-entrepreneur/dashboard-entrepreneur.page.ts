import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-entrepreneur',
  templateUrl: './dashboard-entrepreneur.page.html',
  styleUrls: ['./dashboard-entrepreneur.page.scss'],
  standalone: false
})
export class DashboardEntrepreneurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  interesses: number = 0;
  matchingDevs: number = 0;
  totalDevs: number = 0;
  competences: any[] = [];
  isLoading: boolean = true;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboard();
  }
  ionViewWillEnter() {
    this.loadDashboard();
  }
  loadDashboard() {
    const userId = localStorage.getItem('userId');
    this.isLoading = true;
    this.http
      .get<any>(`${this.apiUrl}/dashboard.php?userId=${userId}`)
      .subscribe({
        next: data => {
          this.interesses = data.interesses;
          this.matchingDevs = data.matching_devs;
          this.totalDevs = data.total_devs;
          this.competences = data.competences;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }
  retour() {
    this.router.navigate(['/accueil-entrepreneur']);
  }
}
