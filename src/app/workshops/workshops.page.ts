import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AlertController,
  LoadingController,
  ToastController,
  InfiniteScrollCustomEvent,
  AnimationController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface Workshop {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  date: string;
  price: number;
  order_num: number;
  max_participants: number;
  participants: number;
  entrepreneur_name: string;
  is_free: boolean;
}

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.page.html',
  styleUrls: ['./workshops.page.scss'],
  standalone: false
})
export class WorkshopsPage implements OnInit {
  workshops: Workshop[] = [];
  loading = true;
  page = 1;

  // ── Premium ──────────────────────────
  isPremium: boolean = false;
  showPremiumModal: boolean = false;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private animationCtrl: AnimationController,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkPremium();
    this.loadWorkshops(true);
  }

  // Vérifie si l'utilisateur est premium
  checkPremium() {
    this.isPremium = localStorage.getItem('is_premium') === 'true';
  }

  async loadWorkshops(refresh = false) {
    if (refresh) {
      this.page = 1;
      this.workshops = [];
    }

    const loader = await this.loadingCtrl.create({
      message: 'Chargement des workshops...',
      spinner: 'crescent'
    });
    await loader.present();

    try {
      const response: any = await this.http.get(
        `${this.apiUrl}/workshops.php?page=${this.page}`
      ).toPromise();

      if (refresh) {
        this.workshops = response.workshops;
      } else {
        this.workshops.push(...response.workshops);
      }

      this.animateCards();
      loader.dismiss();
      this.loading = false;

    } catch (error) {
      console.error('API Error:', error);
      loader.dismiss();
      this.showToast('Erreur de connexion', 'danger');
      this.loading = false;
    }
  }

  private animateCards() {
    this.workshops.forEach((workshop, index) => {
      setTimeout(() => {
        const card = document.querySelector(`#card-${workshop.id}`) as HTMLElement;
        if (card) {
          this.animationCtrl
            .create()
            .addElement(card)
            .duration(500)
            .easing('ease-out')
            .fromTo('transform', 'translateY(20px)', 'translateY(0)')
            .fromTo('opacity', '0', '1')
            .play();
        }
      }, index * 80);
    });
  }

  // Workshop gratuit = order_num === 1 OU is_free === true
  isFree(workshop: Workshop): boolean {
    return workshop.order_num === 1 || workshop.is_free === true;
  }

  getProgress(workshop: Workshop): number {
    if (!workshop.max_participants) return 0;
    return Math.round((workshop.participants / workshop.max_participants) * 100);
  }

  async joinWorkshop(workshop: Workshop) {
    const isFreeWorkshop = this.isFree(workshop);

    if (isFreeWorkshop || this.isPremium) {
      // Accès direct au workshop
      await this.startWorkshop(workshop);
    } else {
      // Afficher modal premium
      this.showPremiumModal = true;
    }
  }

  private async startWorkshop(workshop: Workshop) {
    const toast = await this.toastCtrl.create({
      message: `🎓 Accès à "${workshop.title}"`,
      duration: 2000,
      color: 'success',
      icon: 'play-circle'
    });
    await toast.present();

    // Navigation vers le player vidéo
    // this.router.navigate(['/workshop-player', workshop.id]);
  }

  async doRefresh(event: any) {
    await this.loadWorkshops(true);
    event.target.complete();
  }

  async loadMore(ev: InfiniteScrollCustomEvent) {
    this.page++;
    await this.loadWorkshops(false);
    ev.target.complete();

    if (this.workshops.length >= 20) {
      ev.target.disabled = true;
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  trackById(index: number, workshop: Workshop): number {
    return workshop.id;
  }
}