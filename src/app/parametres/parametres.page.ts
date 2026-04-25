import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from '../shared/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.page.html',
  styleUrls: ['./parametres.page.scss'],
  standalone: false,
})
export class ParametresPage implements OnInit {
  private apiUrl = environment.apiUrl;
  userName: string = '';
  profileImage: string = '';
  
  
// Dans le .ts correspondant
selectedLang = this.languageService.getCurrentLang();


  constructor(
    private modalController: ModalController,
    private router: Router,
    private http: HttpClient,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

 /* ngOnInit() {
    const prenom = localStorage.getItem('prenom') || '';
    const nom = localStorage.getItem('nom') || '';
    this.userName = `${prenom} ${nom}`.trim() || 'Utilisateur';

    // const photo = localStorage.getItem('profileImage') || '';
    //this.profileImage = photo ? `${this.apiUrl}/${photo}` : '';
    const photo = localStorage.getItem('profileImage') || '';
    this.profileImage = photo ? `http://localhost:8000/${photo}` : '';
  }*/
 ngOnInit() {
  this.loadUserFromDB();
  const photo = localStorage.getItem('profileImage') || '';
  this.profileImage = photo ? `http://localhost:8000/${photo}` : '';
}
async loadUserFromDB() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
  try {
    const role = localStorage.getItem('role');
    const endpoint = role === 'developer' ? 'get_developers.php' : 'profile_entrepreneur.php';
    const data: any = await firstValueFrom(
      this.http.get(`${this.apiUrl}/${endpoint}`, {
        params: { userId }
      })
    );

    let dev: any = null;
    if (Array.isArray(data)) {
      dev = data.find((d: any) => d.user_id == userId);
    } else {
      dev = data;
    }

    const prenom = dev?.Prenomdev || dev?.Prenom || localStorage.getItem('prenom') || '';
    const nom = dev?.Nomdev || dev?.Nom || localStorage.getItem('nom') || '';
    this.userName = `${prenom} ${nom}`.trim() || 'Utilisateur';
    localStorage.setItem('prenom', prenom);
    localStorage.setItem('nom', nom);
  } catch (err) {
    const prenom = localStorage.getItem('prenom') || '';
    const nom = localStorage.getItem('nom') || '';
    this.userName = `${prenom} ${nom}`.trim() || 'Utilisateur';
  }
}

  onImageError(event: any) {
    event.target.src = 'assets/profile_avatar.jpeg';
  }
  ModeSombre() {
    this.modalController.dismiss();
    this.router.navigate(['/dark-mode-settings']);
  }

  close() {
    this.modalController.dismiss();
  }
  openProfile() {
    this.modalController.dismiss();
    this.router.navigate(['/profile-dev']);
  }
  mesEvaluations() {
    this.modalController.dismiss();
    this.router.navigate(['/mes-evaluations']);
  }
  save() {
    this.modalController.dismiss();
    this.router.navigate(['/sauvegarder']);
  }
  aide() {
    this.modalController.dismiss();
    this.router.navigate(['/aide']);
  }
  logout() {
    localStorage.clear();
    this.modalController.dismiss();
    this.router.navigate(['/home']);
  }
  changeLang(event: any) {
    const lang = event.detail.value;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }
}
