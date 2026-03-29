import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  private apiUrl = environment.apiUrl;

  user = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {}

  register() {
    if (!this.user.role) {
      this.alertsService.alert('Veuillez choisir un rôle');
      return;
    }

    this.http.post(`${this.apiUrl}/register.php`, this.user).subscribe({
      next: (response: any) => {
        localStorage.setItem('role', this.user.role);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('token', 'token-' + Date.now());
        localStorage.setItem('prenom', this.user.prenom);
        localStorage.setItem('nom', this.user.nom);

        if (this.user.role === 'developer') {
          localStorage.setItem('is', 'dev');
          this.router.navigate(['/accueil-developpeur']);
        } else if (this.user.role === 'entrepreneur') {
          localStorage.setItem('is', 'business');
          this.router.navigate(['/accueil-entrepreneur']);
        }

        localStorage.setItem('connected', 'true');
      },
      error: () => {
        this.alertsService.alert("Erreur lors de l'inscription");
      },
    });
  }
}
