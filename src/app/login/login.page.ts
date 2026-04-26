import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-inscription',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class SigninPage implements OnInit {
  private apiUrl = environment.apiUrl;

  user = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {}

 /* login() {
    if (!this.user.email || !this.user.password) {
      return;
    }

    firstValueFrom(this.http.post(`${this.apiUrl}/login.php`, this.user))
      .then((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('prenom', response.user.prenom || '');
        localStorage.setItem('nom', response.user.nom || '');
        localStorage.setItem('profileImage', response.user.photo || '');
        localStorage.setItem('entreprise', response.user.entreprise || '');

        if (response.user.role === 'developer') {
          this.router.navigate(['/accueil-developpeur']);
          localStorage.setItem('is', 'dev');
        } else if (response.user.role === 'entrepreneur') {
          this.router.navigate(['/accueil-entrepreneur']);
          localStorage.setItem('is', 'business');
        }
        localStorage.setItem('connected', 'true');
      })
      .catch((ex) => {
        this.alertsService.alert('Email ou mot de passe incorrect');
      });
  }
}*/
login() {
  if (!this.user.email || !this.user.password) {
    return;
  }

  firstValueFrom(this.http.post(`${this.apiUrl}/login.php`, this.user))
    .then((response: any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('prenom', response.user.prenom || '');
      localStorage.setItem('nom', response.user.nom || '');
      localStorage.setItem('profileImage', response.user.photo || '');
      localStorage.setItem('entreprise', response.user.entreprise || '');
      localStorage.setItem('connected', 'true');

      if (response.user.role === 'developer') {
        this.router.navigate(['/accueil-developpeur']);
        localStorage.setItem('is', 'dev');
      } else if (response.user.role === 'entrepreneur') {
        this.router.navigate(['/accueil-entrepreneur']);
        localStorage.setItem('is', 'business');
      } else if (response.user.role === 'admin') {
        this.router.navigate(['/admin']);
        localStorage.setItem('is', 'admin');
      }
    })
    .catch((ex) => {
      this.alertsService.alert('Email ou mot de passe incorrect');
    });
}
}
