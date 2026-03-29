import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';
import { Developer } from '../shared/models/developper';

@Component({
  selector: 'app-profile-dev',
  templateUrl: './profile-dev.page.html',
  styleUrls: ['./profile-dev.page.scss'],
  standalone: false,
})
export class ProfileDevPage implements OnInit, OnDestroy {
  private apiUrl = environment.apiUrl;
  loading = true;

  skills: string[] = [];

  portfolio: File | null = null;
  profileImage: string = 'assets/profile_avatar.jpeg';
  profileImageFile: File | null = null;
  SelectedFileName: string | null = null;

  developer!: Developer;

  @ViewChild('fileInput', { static: false }) fileInput: any;
  @ViewChild('portfolioInput', { static: false }) portfolioInput!: ElementRef;
  routeQueryParams$: Subscription;
  isViewMode: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService,
    private route: ActivatedRoute,
  ) {
    this.routeQueryParams$ = this.route.queryParams.subscribe(
      async (params) => {
        this.isViewMode = params?.['view'] === 'summary';
        var userId = params?.['user_id'];

        setTimeout(() => {
          this.loadProfile(userId);
        }, 100);
      },
    );
  }

  ngOnDestroy(): void {
    this.routeQueryParams$?.unsubscribe();
  }

  ngOnInit() {}

  loadProfile(user_id?: number) {
    const userId = user_id ?? localStorage.getItem('userId');
    if (!userId) return;

    firstValueFrom(
     /* this.http.get<any>(`${this.apiUrl}/profile_dev.php?userId=${userId}`),*/
     this.http.get<any>(`${this.apiUrl}/profile_dev.php`, {
  params: { userId: userId }
})
    )
      .then((profile) => {
        if (!profile || Object.keys(profile).length === 0) return;
        this.developer = profile;

        this.skills = (profile.CompetencesTechniques ?? '').split(',');

        this.profileImage = profile.profileImage || 'assets/profile_avatar.jpeg';
        this.SelectedFileName = profile.portfolio || null;
        this.loading = false;
      })
      .catch((err) => console.error(' Erreur chargement profil:', err));
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

  updateProfile() {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('user_id', localStorage.getItem('userId') || '');
    formData.append('Nomdev', this.developer?.Nomdev ?? '');
    formData.append('Prenomdev', this.developer?.Prenomdev ?? '');
    formData.append('Pseudo', this.developer?.Pseudo ?? '');
    formData.append('Emaildev', this.developer?.Emaildev ?? '');
    formData.append('Telephone', this.developer?.Telephone ?? '');
    formData.append(
      'CompetencesTechniques',
      this.developer?.CompetencesTechniques ?? '',
    );
    formData.append('Experience', '' + (this.developer?.Experience ?? ''));
    formData.append('Niveau', this.developer?.Niveau ?? '');
    formData.append('DateNaissance', this.developer?.DateNaissance ?? '');
    formData.append('Pays', this.developer?.Pays ?? '');
    formData.append('Ville', this.developer?.Ville ?? '');
    formData.append('Biographie', this.developer?.Biographie ?? '');
    formData.append('Github', this.developer?.Github ?? '');
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
    const selectedDev: Developer = JSON.parse(
      localStorage.getItem('selectedDeveloper') || '{}',
    );
    this.router.navigate(['/chat'], {
      queryParams: {
        userId: selectedDev.user_id,
      },
    });
  }
}
