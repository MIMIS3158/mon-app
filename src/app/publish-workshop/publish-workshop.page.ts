/*import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-publish-workshop',
  templateUrl: './publish-workshop.page.html',
  styleUrls: ['./publish-workshop.page.scss'],
  standalone: false,
})
export class PublishWorkshopPage implements OnInit {
  private apiUrl = environment.apiUrl;

  isSubmitting = false;
  thumbError = false;

  workshop = {
    title: '',
    description: '',
    video_url: '',
    thumbnail: '',
    duration: '',
    date: '',
    price: 0,
    max_participants: 50,
    is_free: true,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {}

  onThumbnailChange() {
    this.thumbError = false;
  }

  isValid(): boolean {
    if (!this.workshop.title?.trim()) {
      this.showToast('Le titre est requis', 'warning');
      return false;
    }
    if (!this.workshop.description?.trim()) {
      this.showToast('La description est requise', 'warning');
      return false;
    }
    if (this.workshop.description.trim().length < 20) {
      this.showToast('La description doit faire au moins 20 caractères', 'warning');
      return false;
    }
    return true;
  }

  async publish() {
    if (!this.isValid()) return;

    this.isSubmitting = true;

    const payload = {
      ...this.workshop,
      user_id: localStorage.getItem('userId'),
      price: this.workshop.is_free ? 0 : (this.workshop.price || 0),
      max_participants: this.workshop.max_participants || 50,
    };

    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/workshops.php`, payload)
      );
      await this.showToast('Workshop publié avec succès ! 🎉', 'success');
      this.router.navigate(['/workshops']);
    } catch (err: any) {
      const msg = err?.error?.error || 'Erreur lors de la publication';
      await this.showToast(msg, 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}*/
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-publish-workshop',
  templateUrl: './publish-workshop.page.html',
  styleUrls: ['./publish-workshop.page.scss'],
  standalone: false,
})
export class PublishWorkshopPage implements OnInit {
  private apiUrl = environment.apiUrl;

  isSubmitting = false;
  thumbError = false;
  workshopId: number | null = null;
  isEditMode: boolean = false;

  workshop = {
    title: '',
    description: '',
    video_url: '',
    thumbnail: '',
    duration: '',
    date: '',
    price: 0,
    max_participants: 50,
    is_free: true,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.workshopId = params['id'];
        this.isEditMode = true;
        this.loadWorkshop(this.workshopId);
      }
    });
  }

  async loadWorkshop(id: any) {
    try {
      const data: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/workshops.php`, {
          params: { workshopId: id }
        })
      );
      if (data) {
        this.workshop = {
          title: data.title || '',
          description: data.description || '',
          video_url: data.video_url || '',
          thumbnail: data.thumbnail || '',
          duration: data.duration || '',
          date: data.date || '',
          price: data.price || 0,
          max_participants: data.max_participants || 50,
          is_free: data.is_free == 1 || data.is_free === true,
        };
      }
    } catch (err) {}
  }

  onThumbnailChange() {
    this.thumbError = false;
  }

  isValid(): boolean {
    if (!this.workshop.title?.trim()) {
      this.showToast('Le titre est requis', 'warning');
      return false;
    }
    if (!this.workshop.description?.trim()) {
      this.showToast('La description est requise', 'warning');
      return false;
    }
    if (this.workshop.description.trim().length < 20) {
      this.showToast('La description doit faire au moins 20 caractères', 'warning');
      return false;
    }
    return true;
  }

  async publish() {
    if (!this.isValid()) return;
    this.isSubmitting = true;

    const payload = {
      ...this.workshop,
      user_id: localStorage.getItem('userId'),
      price: this.workshop.is_free ? 0 : (this.workshop.price || 0),
      max_participants: this.workshop.max_participants || 50,
    };

    try {
      if (this.isEditMode && this.workshopId) {
        await firstValueFrom(
          this.http.put(`${this.apiUrl}/workshops.php`, payload, {
            params: { id: this.workshopId! }
          })
        );
        await this.showToast('Workshop modifié avec succès !', 'success');
      } else {
        await firstValueFrom(
          this.http.post(`${this.apiUrl}/workshops.php`, payload)
        );
        await this.showToast('Workshop publié avec succès ! 🎉', 'success');
      }
      this.router.navigate(['/mes-workshops']);
    } catch (err: any) {
      const msg = err?.error?.error || 'Erreur lors de la publication';
      await this.showToast(msg, 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}