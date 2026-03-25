import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile-dev',
  templateUrl: './profile-dev.page.html',
  styleUrls: ['./profile-dev.page.scss'],
  standalone: false
})
export class ProfileDevPage implements OnInit {
  private apiUrl = environment.apiUrl;

  Nomdev: string = '';
  Prenomdev: string = '';
  Pseudo: string = '';
  Emaildev: string = '';
  Telephone: string = '';
  CompetencesTechniques: string = '';
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

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService
  ) {}

  ngOnInit() {
    const selectedDev = localStorage.getItem('selectedDeveloper');
    if (selectedDev) {
      const dev = JSON.parse(selectedDev);
      this.isViewMode = true;
      this.Nomdev = dev.Nomdev || '';
      this.Prenomdev = dev.Prenomdev || '';
      this.CompetencesTechniques = dev.CompetencesTechniques || '';
      this.Experience = dev.Experience || '';
      this.Niveau = dev.Niveau || '';
      this.Ville = dev.Ville || '';
      this.Pays = dev.Pays || '';
      this.Github = dev.Github || '';
      this.profileImage = dev.photo || 'assets/profile_avatar.jpeg';
      this.SelectedFileName = dev.Portfolio || null;
      localStorage.removeItem('selectedDeveloper');
      return;
    }
    this.isViewMode = false;
    this.loadProfile();
  }

  isViewMode: boolean = false;

  loadProfile() {
    const userId = localStorage.getItem('userId');
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

  FileSelected(event: any) {
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

    console.log(' Modification en cours...');
    console.log('user_id:', localStorage.getItem('userId'));

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
