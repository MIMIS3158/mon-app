/*import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {

  user = {
     Nom: '',
     Prenom: '',
     Email:  '',
     Password: '',
     role: ''
  };

  constructor(private router: Router) { }

  ngOnInit() {}

 register() {
  if (!this.user.role) {
    alert('Veuillez choisir un rôle');
    return;
  }
  localStorage.setItem('role', this.user.role);
  if (this.user.role === 'developer') {
    this.router.navigate(['/accueil-developpeur']);
  } else if (this.user.role === 'entrepreneur') {
    this.router.navigate(['/accueil-entrepreneur']);
  }
  
}
}

  //import { Router } from '@angular/router';

//constructor(private router: Router) { }

// Après inscription ou connexion
//goToAccueil(role: string) {
  //if (role === 'developpeur') {
    //this.router.navigate(['/accueil-developpeur']);
  //} else if (role === 'entrepreneur') {
   // this.router.navigate(['/accueil-entrepreneur']);
 // }
//}

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

  private apiUrl = 'http://localhost:8000/api';

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
      return;
    }

    if (!this.user.Nom || !this.user.Prenom || !this.user.Email || !this.user.Password) {
      return;
    }

    this.http.post(`${this.apiUrl}/register`, this.user)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', this.user.role);
          
          if (this.user.role === 'developer') {
            this.router.navigate(['/accueil-developpeur']);
          } else if (this.user.role === 'entrepreneur') {
            this.router.navigate(['/accueil-entrepreneur']);
          }
        },
        error: () => {}
      });
  }
}
*//*
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // ✅ Ajouter

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {

  private apiUrl = 'http://localhost/myApp/api'; // ✅ Ajouter

  user = {
    Nom: '',
    Prenom: '',
    Email: '',
    Password: '',
    role: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient // ✅ Ajouter
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


    if (this.user.role === 'developer') {
        this.router.navigate(['/accueil-developpeur']);
    } else if (this.user.role === 'entrepreneur') {
        this.router.navigate(['/accueil-entrepreneur']);
    }
}
  }
 */ 
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