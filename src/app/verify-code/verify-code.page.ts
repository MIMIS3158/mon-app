/*import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.page.html',
  styleUrls: ['./verify-code.page.scss'],
  
  standalone:false
})
export class VerifyCodePage {

  code = '';
  email = localStorage.getItem('resetEmail');

  constructor(private http: HttpClient, private router: Router) {}

  verifyCode() {
    this.http.post('http://localhost/api/verify-code.php', {
      email: this.email,
      code: this.code
    }).subscribe(() => {

      this.router.navigate(['/reset-password']);

    });
  }
}
*/import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.page.html',
  styleUrls: ['./verify-code.page.scss'],
  standalone: false 
})
export class VerifyCodePage implements OnInit {
  email: string = '';
  code: string[] = ['', '', '', '', '', ''];
  private apiUrl = 'http://localhost/myApp/api';

  @ViewChild('digit1') digit1!: ElementRef;
  @ViewChild('digit2') digit2!: ElementRef;
  @ViewChild('digit3') digit3!: ElementRef;
  @ViewChild('digit4') digit4!: ElementRef;
  @ViewChild('digit5') digit5!: ElementRef;
  @ViewChild('digit6') digit6!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      if (!this.email) {
        this.router.navigate(['/reset-password']);
      }
    });
  }
onCodeInput(index: number, nextInput: HTMLInputElement | null) {
  if (this.code[index]?.length === 1 && nextInput) {
    nextInput.focus();
  }
}

  verifierCode() {
    const fullCode = this.code.join('');
    
    if (fullCode.length !== 6) {
      this.presentToast('Veuillez entrer le code complet', 'warning');
      return;
    }

    this.http.post(`${this.apiUrl}/verify_reset_code.php`, {
      email: this.email,
      code: fullCode
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.presentToast('Code vérifié !', 'success');
          this.router.navigate(['/new-password'], { 
            queryParams: { 
              email: this.email,
              token: response.token
            } 
          });
        } else {
          this.presentToast(response.message || 'Code invalide ou expiré', 'danger');
          this.code = ['', '', '', '', '', ''];
          if (this.digit1) {
            this.digit1.nativeElement.focus();
          }
        }
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.presentToast('Erreur lors de la vérification', 'danger');
      }
    });
  }

  renvoyerCode() {
    this.http.post(`${this.apiUrl}/send_reset_code.php`, { email: this.email })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.presentToast('Nouveau code envoyé !', 'success');
            this.code = ['', '', '', '', '', ''];
            if (this.digit1) {
              this.digit1.nativeElement.focus();
            }
          } else {
            this.presentToast('Erreur lors de l\'envoi', 'danger');
          }
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.presentToast('Erreur lors de l\'envoi', 'danger');
        }
      });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}