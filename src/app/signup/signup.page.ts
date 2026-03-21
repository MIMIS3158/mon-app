
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api';

  user = {
    Nom: '',
    Prenom: '',
    Email: '',
    Password: '',
    role: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  register() {
    if (!this.user.role) {
      alert('Veuillez choisir un rôle');
      return;
    }

    this.http.post(`${this.apiUrl}/register.php`, this.user)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('role', this.user.role);
          localStorage.setItem('userId', response.id);
          localStorage.setItem('token', 'token-' + Date.now());
          localStorage.setItem('prenom', this.user.Prenom); 
          localStorage.setItem('nom', this.user.Nom);

          if (this.user.role === 'developer') {
            this.router.navigate(['/accueil-developpeur']);
          } else if (this.user.role === 'entrepreneur') {
            this.router.navigate(['/accueil-entrepreneur']);
          }
        },
        error: () => {
          alert('Erreur lors de l\'inscription');
        }
      });
  }
}