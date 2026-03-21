import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class SigninPage implements OnInit {
  private apiUrl = 'http://localhost/myApp/api';

  user = {
    Email: '',
    Password: ''
  };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  login() {
    if (!this.user.Email || !this.user.Password) {
      return;
    }

    this.http.post(`${this.apiUrl}/login.php`, this.user)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.user.role);
          localStorage.setItem('userId', response.user.id);
          localStorage.setItem('prenom', response.user.prenom || '');
          localStorage.setItem('nom', response.user.nom || '');
          localStorage.setItem('profileImage', response.user.photo || '');

          if (response.user.role === 'developer') {
            this.router.navigate(['/accueil-developpeur']);
          } else if (response.user.role === 'entrepreneur') {
            this.router.navigate(['/accueil-entrepreneur']);
          }
        },
        error: () => {
          alert('Email ou mot de passe incorrect');
        }
      });
  }
}