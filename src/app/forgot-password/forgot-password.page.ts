import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';


function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pw === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ForgotPasswordPage implements OnInit, OnDestroy {

  private apiUrl = 'http://localhost/myApp/api';

  currentStep = 1;         
  isLoading = false;
  errorMsg = '';

  otpIndexes  = [0,1,2,3,4,5];
  otpDigits: string[] = ['', '', '', '', '', ''];
  resendTimer = 0;
  private timerInterval: any;

  showPw1 = false;
  showPw2 = false;

  strengthPct = 0;
  strengthColor = '#e5e7eb';
  strengthLabel = '';

  private resetToken = '';
  emailForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

 
  sendCode() {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMsg = '';
    const email = this.emailForm.get('email')?.value;

    this.http.post(`${this.apiUrl}/forgot_password.php`, { email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentStep = 2;
        this.startResendTimer();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Email introuvable. Vérifiez votre adresse.';
      }
    });
  }

  
  verifyCode() {
    const code = this.getOtpValue();
    if (code.length < 6) return;
    this.isLoading = true;
    this.errorMsg = '';
    const email = this.emailForm.get('email')?.value;

    this.http.post(`${this.apiUrl}/verify_code.php`, { email, code }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.resetToken = res.reset_token;  
        if (!this.resetToken) {
          this.errorMsg = "Erreur: token manquant. Recommencez la vérification.";
          return;
        }
        this.currentStep = 3;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Code incorrect ou expiré.';
        this.otpDigits = ['', '', '', '', '', ''];
      }
    });
  }
  resetPassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    if (!this.resetToken) { this.errorMsg = "Token manquant."; return; }

    this.isLoading = true;
    this.errorMsg = '';

    const password = this.passwordForm.get('password')?.value;
    const email = this.emailForm.get('email')?.value;

    this.http.post(`${this.apiUrl}/reset_password.php`, {
      reset_token: this.resetToken,
      password: password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.loginAfterReset(email, password);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Erreur lors de la réinitialisation.';
      }
    });
  }
  private loginAfterReset(email: string, password: string) {
    this.http.post(`${this.apiUrl}/login.php`, { Email: email, Password: password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('userId', res.user.id);

        this.goToLogin();
      },
      error: () => {
        this.router.navigateByUrl('/signin');
      }
    });
  }
  goToLogin() {
    const role = localStorage.getItem('role');
    if (role === 'developer') this.router.navigateByUrl('/accueil-developpeur');
    else if (role === 'entrepreneur') this.router.navigateByUrl('/accueil-entrepreneur');
    else this.router.navigateByUrl('/signin');
  }
  getOtpValue(): string { return this.otpDigits.join(''); }
  onOtpInput(event: any, index: number) {
    const val = event.target.value.replace(/\D/g, '');
    this.otpDigits[index] = val ? val[val.length - 1] : '';
    event.target.value = this.otpDigits[index];
    if (val && index < 5) document.getElementById('otp-' + (index + 1))?.focus();
  }
  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0)
      document.getElementById('otp-' + (index - 1))?.focus();
  }
  resendCode() { this.otpDigits = ['', '', '', '', '', '']; this.sendCode(); }
  startResendTimer() {
    this.resendTimer = 60;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) clearInterval(this.timerInterval);
    }, 1000);
  }
  calcStrength() {
    const pw = this.passwordForm.get('password')?.value || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const map = [
      { pct: 0, color: '#e5e7eb', label: '' },
      { pct: 25, color: '#dc2626', label: 'Très faible' },
      { pct: 50, color: '#f59e0b', label: 'Moyen' },
      { pct: 75, color: '#0d9488', label: 'Fort' },
      { pct: 100, color: '#16a34a', label: 'Très fort' },
    ];
    const entry = map[pw.length === 0 ? 0 : Math.min(score, 4)];
    this.strengthPct = entry.pct;
    this.strengthColor = entry.color;
    this.strengthLabel = entry.label;
  }

}