/*import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-profile-entrepreneur',
  templateUrl: './profile-entrepreneur.page.html',
  styleUrls: ['./profile-entrepreneur.page.scss'],
  standalone: false,
})
export class ProfileEntrepreneurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  evaluations: any[] = [];
  moyenneNote: number = 0;
  Nom: string = '';
  Prenom: string = '';
  Email: string = '';

  Telephone: string = '';
  Secteur: string = '';
  Entreprise: string = '';
  Description: string = '';
  profileImage: string = 'assets/profile_avatar.jpeg';
  profileImageFile: File | null = null;
  DateNaissance: string = '';
  Pays: string = '';
  Ville: string = '';
  SiteWeb: string = '';
  Linkedin: string = '';
 
  AnneeCreation: string = '';
 BudgetMoyen: any = '';
  logo: string = '';
logoFile: File | null = null;
logoPreview: string = '';

@ViewChild('logoInput', { static: false }) logoInput: any;

  @ViewChild('fileInput', { static: false }) fileInput: any;

  constructor(
    private http: HttpClient,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadEvaluations();
  }

  loadProfile() {
    firstValueFrom(
      
      this.http.get<any>(`${this.apiUrl}/profile_entrepreneur.php`, {
  params: { userId: localStorage.getItem('userId')! }
})
    ).then((profile) => {
      this.Nom = profile.Nom ?? '';
      this.Prenom = profile.Prenom ?? '';

      this.Email = profile.Email ?? '';
      this.Telephone = profile.Telephone ?? '';
      this.Secteur = profile.Secteur ?? '';
      this.Entreprise = profile.Entreprise ?? '';
      this.Description = profile.Description ?? '';
      this.profileImage = profile.profileImage ?? 'assets/profile_avatar.jpeg';
      this.DateNaissance = profile.DateNaissance ?? '';
      this.Pays = profile.Pays ?? '';
      this.Ville = profile.Ville ?? '';
      this.SiteWeb = profile.SiteWeb ?? '';
      this.Linkedin = profile.Linkedin ?? '';
   
      this.AnneeCreation = profile.AnneeCreation ?? '';
      this.BudgetMoyen = profile.BudgetMoyen ?? '';
      this.logo = profile.logo ?? '';
this.logoPreview = profile.logo ?? '';
    });
  }

  // profile is created after signup -> so do only update
  // createProfile() {
  //   const formData = new FormData();
  //   formData.append('action', 'add');
  //   formData.append('user_id', localStorage.getItem('userId') ?? '');
  //   formData.append('Nom', this.Nom);
  //   formData.append('Prenom', this.Prenom);

  //   formData.append('Email', this.Email);
  //   formData.append('Telephone', this.Telephone);
  //   formData.append('Secteur', this.Secteur);
  //   formData.append('Entreprise', this.Entreprise);
  //   formData.append('Description', this.Description);
  //   formData.append('DateNaissance', this.DateNaissance);
  //   formData.append('Pays', this.Pays);
  //   formData.append('Ville', this.Ville);
  //   formData.append('SiteWeb', this.SiteWeb);
  //   formData.append('Linkedin', this.Linkedin);
  //   formData.append('TailleEntreprise', this.TailleEntreprise);
  //   formData.append('AnneeCreation', this.AnneeCreation);
  //   formData.append('BudgetMoyen', this.BudgetMoyen);
  //   console.log(' Enregistrement en cours...');

  //   this.alertsService.toast(' PROFIL ENREGISTRÉ !');

  //   if (this.profileImageFile) {
  //     formData.append('profileImage', this.profileImageFile);
  //   }

  //   firstValueFrom(
  //     this.http.post(`${this.apiUrl}/profile_entrepreneur.php`, formData)
  //   ).then(() => {
  //     this.loadProfile();
  //   });
  // }

  updateProfile() {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('user_id', localStorage.getItem('userId') ?? '');
    formData.append('Nom', this.Nom);
    formData.append('Prenom', this.Prenom);

    formData.append('Email', this.Email);
    formData.append('Telephone', this.Telephone);
    formData.append('Secteur', this.Secteur);
    formData.append('Entreprise', this.Entreprise);
    formData.append('Description', this.Description);
    formData.append('DateNaissance', this.DateNaissance);
    formData.append('Pays', this.Pays);
    formData.append('Ville', this.Ville);
    formData.append('SiteWeb', this.SiteWeb);
    formData.append('Linkedin', this.Linkedin);
    //formData.append('TailleEntreprise', this.TailleEntreprise);
    formData.append('AnneeCreation', this.AnneeCreation);
    formData.append('BudgetMoyen', String(this.BudgetMoyen ?? ''));
    if (this.logoFile) {
  formData.append('logo', this.logoFile);
}

    if (this.profileImageFile) {
      formData.append('profileImage', this.profileImageFile);
    }

    firstValueFrom(
      this.http.post(`${this.apiUrl}/profile_entrepreneur.php`, formData),
    )
      .then((response: any) => {
        {
          console.log(' Profil modifié avec succès !', response);
          this.alertsService.alert(' PROFIL MODIFIÉ !');
          


           if (response.profileImage) {
      localStorage.setItem('profileImage', response.profileImage);
    }
          this.loadProfile();
          if (response.logo) {
  localStorage.setItem('logo', response.logo);
}
        }
      })
      .catch((ex) => {
        console.error(' Update failed:', ex);
      });
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }

  loadEvaluations() {
    const userId = localStorage.getItem('userId');
    firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/get_evaluations.php`, {
        params: {
          type: 'entrepreneur',
          userId: userId ?? '',
        },
      }),
    ).then((evals) => {
      {
        this.evaluations = evals;
        if (evals.length > 0) {
          const total = evals.reduce((sum, e) => sum + e.note, 0);
          this.moyenneNote = total / evals.length;
        }
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.profileImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  selectLogo() {
  this.logoInput.nativeElement.click();
}

onLogoSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  this.logoFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    this.logoPreview = reader.result as string;
  };
  reader.readAsDataURL(file);
}
}
*/
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-profile-entrepreneur',
  templateUrl: './profile-entrepreneur.page.html',
  styleUrls: ['./profile-entrepreneur.page.scss'],
  standalone: false,
})
export class ProfileEntrepreneurPage implements OnInit {
  private apiUrl = environment.apiUrl;

  isViewMode: boolean = false;
  viewUserId: number = 0;

  evaluations: any[] = [];
  moyenneNote: number = 0;
  Nom: string = '';
  Prenom: string = '';
  Email: string = '';
  Telephone: string = '';
  Secteur: string = '';
  Entreprise: string = '';
  Description: string = '';
  profileImage: string = 'assets/default-avatar.png';
  profileImageFile: File | null = null;
  DateNaissance: string = '';
  Pays: string = '';
  Ville: string = '';
  SiteWeb: string = '';
  Linkedin: string = '';
  AnneeCreation: string = '';
  BudgetMoyen: any = '';
  logo: string = '';
  logoFile: File | null = null;
  logoPreview: string = '';

  @ViewChild('logoInput', { static: false }) logoInput: any;
  @ViewChild('fileInput', { static: false }) fileInput: any;

  constructor(
    private http: HttpClient,
    private alertsService: AlertsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isViewMode = params?.['view'] === 'summary';
      const userId = params?.['user_id'];
      if (userId) this.viewUserId = parseInt(userId);
      this.loadProfile(userId);
    });
    this.loadEvaluations();
    
  }

  loadProfile(user_id?: any) {
    const userId = user_id ?? localStorage.getItem('userId');
    if (!userId) return;

    firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/profile_entrepreneur.php`, {
        params: { userId: userId }
      })
    ).then((profile) => {
      this.Nom = profile.Nom ?? '';
      this.Prenom = profile.Prenom ?? '';
      this.Email = profile.Email ?? '';
      this.Telephone = profile.Telephone ?? '';
      this.Secteur = profile.Secteur ?? '';
      this.Entreprise = profile.Entreprise ?? '';
      this.Description = profile.Description ?? '';
      this.profileImage = profile.profileImage ?? 'assets/default-avatar.png';
      this.DateNaissance = profile.DateNaissance ?? '';
      this.Pays = profile.Pays ?? '';
      this.Ville = profile.Ville ?? '';
      this.SiteWeb = profile.SiteWeb ?? '';
      this.Linkedin = profile.Linkedin ?? '';
      this.AnneeCreation = profile.AnneeCreation ?? '';
      this.BudgetMoyen = profile.BudgetMoyen ?? '';
      this.logo = profile.logo ?? '';
      this.logoPreview = profile.logo ?? '';
    });
  }

  contact() {
    this.router.navigate(['/chat'], {
      queryParams: { userId: this.viewUserId }
    });
  }

  updateProfile() {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('user_id', localStorage.getItem('userId') ?? '');
    formData.append('Nom', this.Nom);
    formData.append('Prenom', this.Prenom);
    formData.append('Email', this.Email);
    formData.append('Telephone', this.Telephone);
    formData.append('Secteur', this.Secteur);
    formData.append('Entreprise', this.Entreprise);
    formData.append('Description', this.Description);
    formData.append('DateNaissance', this.DateNaissance);
    formData.append('Pays', this.Pays);
    formData.append('Ville', this.Ville);
    formData.append('SiteWeb', this.SiteWeb);
    formData.append('Linkedin', this.Linkedin);
    formData.append('AnneeCreation', this.AnneeCreation);
    formData.append('BudgetMoyen', String(this.BudgetMoyen ?? ''));
    if (this.logoFile) formData.append('logo', this.logoFile);
    if (this.profileImageFile) formData.append('profileImage', this.profileImageFile);

    firstValueFrom(
      this.http.post(`${this.apiUrl}/profile_entrepreneur.php`, formData),
    ).then((response: any) => {
      this.alertsService.alert('PROFIL MODIFIÉ !');
      if (response.profileImage) localStorage.setItem('profileImage', response.profileImage);
      if (response.logo) localStorage.setItem('logo', response.logo);
      this.loadProfile();
    }).catch((ex) => {
      console.error('Update failed:', ex);
    });
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.profileImageFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.profileImage = reader.result as string; };
    reader.readAsDataURL(file);
  }

  selectLogo() {
    this.logoInput.nativeElement.click();
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.logoFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.logoPreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  loadEvaluations() {
  const userId = this.isViewMode 
    ? this.viewUserId 
    : localStorage.getItem('userId');

  if (!userId) return;

  firstValueFrom(
    this.http.get<any[]>(`${this.apiUrl}/get_evaluations.php`, {
      params: {
        userId: userId.toString(),
      },
    }),
  ).then((evals) => {
    this.evaluations = evals;
    if (evals.length > 0) {
      const total = evals.reduce((sum, e) => sum + e.note, 0);
      this.moyenneNote = total / evals.length;
    }
  });
}
}