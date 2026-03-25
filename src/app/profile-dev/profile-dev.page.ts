import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-profile-dev',
  templateUrl: './profile-dev.page.html',
  styleUrls: ['./profile-dev.page.scss'],
  standalone: false
})
export class ProfileDevPage implements OnInit, OnDestroy {
  private apiUrl = environment.apiUrl;

  Nomdev: string = '';
  Prenomdev: string = '';
  Pseudo: string = '';
  Emaildev: string = '';
  Telephone: string = '';
  CompetencesTechniques: string = '';
  skills: string[] = [];

  Experience: string = '';
  portfolio: File | null = null;
  profileImage: string = 'assets/profile_avatar.jpeg';
  profileImageFile: File | null = null;
  SelectedFileName: string | null = null;
  Niveau: string = '';
  DateNaissance: string = '';
  Pays: string = '';
  Ville: string = '';
  Biographie: string = '';
  Github: string = '';

  @ViewChild('fileInput', { static: false }) fileInput: any;
  @ViewChild('portfolioInput', { static: false }) portfolioInput!: ElementRef;
  routeQueryParams$: Subscription;
  isViewMode: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService,
    private route: ActivatedRoute
  ) {
    this.routeQueryParams$ = this.route.queryParams.subscribe(async params => {
      this.isViewMode = params?.['view'] === 'summary';
      var userId = params?.['user_id'];

      setTimeout(() => {
        this.loadProfile(userId);
      }, 100);
    });
  }

  ngOnDestroy(): void {
    this.routeQueryParams$?.unsubscribe();
  }

  ngOnInit() {}

  loadProfile(user_id?: number) {
    const userId = user_id ?? localStorage.getItem('userId');
    if (!userId) return;

    firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/profile_dev.php?userId=${userId}`)
    )
      .then(profile => {
        if (!profile || Object.keys(profile).length === 0) return;
        this.Nomdev = profile.Nomdev || '';
        this.Prenomdev = profile.Prenomdev || '';
        this.Pseudo = profile.Pseudo || '';
        this.Emaildev = profile.Emaildev || '';
        this.Telephone = profile.Telephone || '';
        this.CompetencesTechniques = profile.CompetencesTechniques || '';
        this.skills = (this.CompetencesTechniques ?? '').split(',');

        this.Experience = profile.Experience || '';
        this.profileImage =
          profile.profileImage || 'assets/profile_avatar.jpeg';
        this.SelectedFileName = profile.portfolio || null;
        this.Niveau = profile.Niveau || '';
        this.DateNaissance = profile.DateNaissance || '';
        this.Pays = profile.Pays || '';
        this.Ville = profile.Ville || '';
        this.Biographie = profile.Biographie || '';
        this.Github = profile.Github || '';
      })
      .catch(err => console.error(' Erreur chargement profil:', err));
  }

  selectImage() {
    this.fileInput.nativeElement.click();
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

  openFilePicker() {
    this.portfolioInput.nativeElement.click();
  }

  selectFile(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.portfolio = file;
      this.SelectedFileName = file.name;
    }
  }

  // profile is created after signup -> so do only update
  // saveProfile() {
  //   const formData = new FormData();
  //   formData.append('action', 'add');
  //   formData.append('user_id', localStorage.getItem('userId') || '');
  //   formData.append('Nomdev', this.Nomdev);
  //   formData.append('Prenomdev', this.Prenomdev);
  //   formData.append('Pseudo', this.Pseudo);
  //   formData.append('Emaildev', this.Emaildev);
  //   formData.append('Telephone', this.Telephone);
  //   formData.append('CompetencesTechniques', this.CompetencesTechniques);
  //   formData.append('Experience', this.Experience);
  //   formData.append('Niveau', this.Niveau);
  //   formData.append('DateNaissance', this.DateNaissance);
  //   formData.append('Pays', this.Pays);
  //   formData.append('Ville', this.Ville);
  //   formData.append('Biographie', this.Biographie);
  //   formData.append('Github', this.Github);
  //   if (this.profileImageFile)
  //     formData.append('profileImage', this.profileImageFile);
  //   if (this.portfolio) formData.append('portfolio', this.portfolio);

  //   console.log(' Enregistrement en cours...');
  //   this.alertsService.alert(' PROFIL ENREGISTRÉ !');

  //   this.http.post(`${this.apiUrl}/profile_dev.php`, formData).subscribe({
  //     next: (response: any) => {
  //       console.log(' Profil enregistré avec succès !', response);
  //       this.loadProfile();
  //     },
  //     error: (err: any) => {
  //       console.error(' Erreur enregistrement:', err);
  //     }
  //   });
  // }

  updateProfile() {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('user_id', localStorage.getItem('userId') || '');
    formData.append('Nomdev', this.Nomdev);
    formData.append('Prenomdev', this.Prenomdev);
    formData.append('Pseudo', this.Pseudo);
    formData.append('Emaildev', this.Emaildev);
    formData.append('Telephone', this.Telephone);
    formData.append('CompetencesTechniques', this.CompetencesTechniques);
    formData.append('Experience', this.Experience);
    formData.append('Niveau', this.Niveau);
    formData.append('DateNaissance', this.DateNaissance);
    formData.append('Pays', this.Pays);
    formData.append('Ville', this.Ville);
    formData.append('Biographie', this.Biographie);
    formData.append('Github', this.Github);
    if (this.profileImageFile)
      formData.append('profileImage', this.profileImageFile);
    if (this.portfolio) formData.append('portfolio', this.portfolio);

    // console.log(' Modification en cours...');
    // console.log('user_id:', localStorage.getItem('userId'));

    firstValueFrom(this.http.post(`${this.apiUrl}/profile_dev.php`, formData))
      .then((response: any) => {
        console.log(' Profil modifié avec succès !', response);
        this.alertsService.toast(' PROFIL MODIFIÉ !');
        this.loadProfile();
      })
      .catch((err: any) => {
        console.error(' Erreur modification:', err);
      });
  }

  contact() {
    const selectedDev = JSON.parse(
      localStorage.getItem('selectedDeveloper') || '{}'
    );
    this.router.navigate(['/chat'], {
      queryParams: {
        developerId: selectedDev.id
      }
    });
  }
}
