import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  standalone: false
})
export class ForgotPasswordPage {

  //email = '';

  constructor(private http: HttpClient, private router: Router) {}

 /* sendCode() {
    this.http.post('http://localhost/api/send-code.php', {
      email: this.email
    }).subscribe(() => {

      localStorage.setItem('resetEmail', this.email);
      this.router.navigate(['/verify-code']);

    });
  }*/
}
