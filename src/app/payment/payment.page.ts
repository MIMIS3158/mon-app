import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: false,
})
export class PaymentPage implements OnInit {
  private apiUrl = environment.apiUrl;

  selectedPlan: string = 'monthly';
  selectedMethod: string = 'ccp';
  isProcessing: boolean = false;
  isPremium: boolean = false;
  premiumExpiresAt: string | null = null;
   // CCP
  ccpNumber: string = '';
  ccpKey: string = '';
  ccpName: string = '';

  // DAHABIA
  cardNumber: string = '';
  cardName: string = '';
  cardExp: string = '';
  cardCvv: string = '';


  plans: any = {
    monthly:   { label: 'Mensuel',     price: 990,  duration: 30,  days: '1 mois' },
    quarterly: { label: 'Trimestriel', price: 2490, duration: 90,  days: '3 mois' },
    yearly:    { label: 'Annuel',      price: 7190, duration: 365, days: '12 mois' },
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.checkPremiumStatus();
    
  }

  async checkPremiumStatus() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const data: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/dashboard.php`, {
          params: { userId }
        })
      );
      this.isPremium = data.is_premium ?? false;
      this.premiumExpiresAt = data.premium_expires_at ?? null;
    } catch (err) {}
  }

  selectPlan(plan: string) {
    if (!this.isPremium) this.selectedPlan = plan;
  }

  getPlanLabel()    { return this.plans[this.selectedPlan]?.label || ''; }
  getPlanPrice()    { return this.plans[this.selectedPlan]?.price || 0; }
  getPlanDuration() { return this.plans[this.selectedPlan]?.days || ''; }

  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Copié !', 'success');
    } catch { this.showToast('Impossible de copier', 'warning'); }
  }
/*
  async proceedPayment() {
    if (this.isPremium) return;
    this.isProcessing = true;

    const userId = localStorage.getItem('userId');
    const plan = this.plans[this.selectedPlan];

    try {
      const res: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/payment.php`, {
          user_id:  userId,
          plan:     this.selectedPlan,
          amount:   plan.price,
          duration: plan.duration,
        })
      );

      if (res.success) {
        this.isPremium = true;
        this.premiumExpiresAt = res.expires_at;
        localStorage.setItem('is_premium', 'true');
        await this.showToast('🎉 Abonnement Pro activé !', 'success');
        setTimeout(() => this.router.navigate(['/accueil-entrepreneur']), 1500);
      } else {
        this.showToast(res.error || 'Erreur de paiement', 'danger');
      }
    } catch (err) {
      this.showToast('Erreur de connexion', 'danger');
    } finally {
      this.isProcessing = false;
    }
  }
*/async proceedPayment() {
  if (this.isPremium) return;

  const payload: any = {
    user_id: localStorage.getItem('userId'),
    plan: this.selectedPlan,
    method: this.selectedMethod
  };

  if (this.selectedMethod === 'ccp') {
    if (!this.ccpNumber || !this.ccpKey || !this.ccpName) {
      this.showToast('Remplis les infos CCP', 'warning');
      return;
    }
    payload.ccpNumber = this.ccpNumber;
    payload.ccpKey    = this.ccpKey;
    payload.ccpName   = this.ccpName;
  }

  if (this.selectedMethod === 'dahabia') {
    if (!this.cardNumber || !this.cardExp || !this.cardCvv || !this.cardName) {
      this.showToast('Remplis les infos carte', 'warning');
      return;
    }
    payload.cardNumber = this.cardNumber;
    payload.cardExp    = this.cardExp;
    payload.cardCvv    = this.cardCvv;
    payload.cardName   = this.cardName;
  }

  this.isProcessing = true;
  try {
    const res: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/payment.php`, payload)
    );
   /* if (res.success) {
      this.isPremium = true;
      this.premiumExpiresAt = res.expires_at;
      localStorage.setItem('is_premium', 'true');
      await this.showToast('🎉 Abonnement Pro activé !', 'success');
     // setTimeout(() => this.router.navigate(['/accueil-entrepreneur']), 1500);
     const role = localStorage.getItem('role');
const returnUrl = role === 'developer' ? '/accueil-developpeur' : '/accueil-entrepreneur';
setTimeout(() => this.router.navigate([returnUrl]), 1500);*/
if (res.success) {
  this.isPremium = true;
  this.premiumExpiresAt = res.expires_at;
  localStorage.setItem('is_premium', 'true');
  await this.showToast('🎉 Abonnement Pro activé !', 'success');
  const role = localStorage.getItem('role');
  const returnUrl = role === 'developer' ? '/accueil-developpeur' : '/accueil-entrepreneur';
  setTimeout(() => this.router.navigate([returnUrl]), 1500);
}else {
      this.showToast(res.error || 'Erreur', 'danger');
    }
  } catch (err) {
    this.showToast('Erreur de connexion', 'danger');
  } finally {
    this.isProcessing = false;
  }
}
private async showToast(msg: string, color: string) {
  const t = await this.toastCtrl.create({
    message: msg, duration: 2500, color, position: 'bottom'
  });
  await t.present();
}
}