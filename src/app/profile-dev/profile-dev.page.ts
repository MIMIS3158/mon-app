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
evaluations: any[] = [];
moyenneNote: number = 0;
//projects: { name: string; tech: string; icon: string }[] = []; // ← AJOUTER
projects: { id?: number; name: string; tech: string; icon: string }[] = [];

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
          this.loadEvaluations();
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
       // this.SelectedFileName = profile.portfolio || null;
      this.SelectedFileName = profile.portfolio || null;

this.projects = (profile.projects || []).map((p: any) => ({
  id: p.id,
  name: p.name,
  tech: p.tech || 'PDF',
  icon: '📄'
}));


        this.loading = false;
      const annees = this.extraireAnnees(profile.Experience ?? '');
const missions = profile.missions_completees ?? 0;
this.developer.Niveau = this.calculerNiveau(annees, missions);
        
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

 /* openFilePicker() {
    this.portfolioInput.nativeElement.click();
  }*/
openFilePicker() {
  const input = document.querySelector('input[type="file"].hidden-file-input') as HTMLInputElement;
  if (input) input.click();
}
  /*selectFile(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.portfolio = file;
      this.SelectedFileName = file.name;
    }
  }*/
selectFile(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  this.portfolio = file;
  this.SelectedFileName = file.name;

  const formData = new FormData();
  formData.append('action', 'add_project');
  formData.append('user_id', localStorage.getItem('userId') || '');
  formData.append('name', file.name.replace(/\.[^/.]+$/, ''));
  formData.append('tech', file.type.includes('pdf') ? 'PDF' : file.type);
  formData.append('portfolio', file);

  firstValueFrom(this.http.post<any>(`${this.apiUrl}/profile_dev.php`, formData))
    .then((res) => {
      if (res.success) {
        this.projects.push({
          name: res.name,
          tech: res.tech,
          icon: '📄'
        });
      }
    })
    .catch(err => console.error('Erreur ajout projet:', err));
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
    /*  .then((response: any) => {
        console.log(' Profil modifié avec succès !', response);
       this.alertsService.alert(' PROFIL MODIFIÉ !');
        
         if (response.profileImage) {
      localStorage.setItem('profileImage', response.profileImage);
    }
    
        this.loadProfile();
      })*/
     .then((response: any) => {
  console.log(' Profil modifié avec succès !', response);
  this.alertsService.alert(' PROFIL MODIFIÉ !');
  if (response.profileImage) {
    localStorage.setItem('profileImage', response.profileImage);
  }
  // ← Ne pas appeler loadProfile() pour ne pas écraser projects[]
})
      .catch((err: any) => {
        console.error(' Erreur modification:', err);
      });
  }
  calculerNiveau(annees: number, missions: number): string {
  if (annees >= 5 || missions >= 10) return 'Senior';
  if (annees >= 2 || missions >= 4) return 'Intermédiaire';
  return 'Junior';
}

extraireAnnees(experience: string): number {
  const match = experience?.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
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
  addSkill() {
  const skill = prompt('Ajouter une compétence :');
  if (skill && skill.trim()) {
    this.skills.push(skill.trim());
    this.developer.CompetencesTechniques = this.skills.join(',');
  }
}
removeSkill(index: number) {
  this.skills.splice(index, 1);
  this.developer.CompetencesTechniques = this.skills.join(',');
}

removeProject(index: number, project: any) {
  // Supprimer de l'interface
  this.projects.splice(index, 1);

  // Supprimer du serveur si le projet a un id
  if (project.id) {
    const formData = new FormData();
    formData.append('action', 'delete_project');
    formData.append('project_id', project.id);
    formData.append('user_id', localStorage.getItem('userId') || '');

    firstValueFrom(this.http.post<any>(`${this.apiUrl}/profile_dev.php`, formData))
      .catch(err => console.error('Erreur suppression projet:', err));
  }
}
loadEvaluations() {
  const userId = this.isViewMode
    ? this.route.snapshot.queryParams['user_id']
    : localStorage.getItem('userId');

  if (!userId) return;

  firstValueFrom(
    this.http.get<any[]>(`${this.apiUrl}/get_evaluations.php`, {
      params: { userId: userId.toString() },
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
