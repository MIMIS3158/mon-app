import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false,
})
export class AdminPage implements OnInit {
  private apiUrl = environment.apiUrl;

  selectedTab = 'users';
  searchTerm = '';
  stats: any = {};
  users: any[] = [];
  filteredUsers: any[] = [];
  reports: any[] = [];

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadUsers();
    this.loadReports();
  }

  async loadStats() {
    try {
      this.stats = await firstValueFrom(
        this.http.get(`${this.apiUrl}/admin.php?action=get_stats`)
      );
    } catch(err) {}
  }

  async loadUsers() {
    try {
      const users: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/admin.php?action=get_users`)
      );
      this.users = users;
      this.filteredUsers = users;
    } catch(err) {}
  }

  async loadReports() {
    try {
      const reports: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/admin.php?action=get_reports`)
      );
      this.reports = reports;
    } catch(err) {}
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.nom?.toLowerCase().includes(term) ||
      u.prenom?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  }

  onTabChange() {
    if (this.selectedTab === 'reports') this.loadReports();
    if (this.selectedTab === 'users') this.loadUsers();
  }

  async toggleBlock(user: any) {
    const action = user.is_blocked ? 'unblock_user' : 'block_user';
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/admin.php?action=${action}`, {
          user_id: user.id
        })
      );
      user.is_blocked = user.is_blocked ? 0 : 1;
      this.showToast(
        user.is_blocked ? 'Utilisateur bloqué ✅' : 'Utilisateur débloqué ✅',
        user.is_blocked ? 'warning' : 'success'
      );
      this.loadStats();
    } catch(err) {}
  }

  async deleteUser(user: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: `Supprimer ${user.nom} ${user.prenom} définitivement ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: async () => {
            try {
              await firstValueFrom(
                this.http.post(`${this.apiUrl}/admin.php?action=delete_user`, {
                  user_id: user.id
                })
              );
              this.users = this.users.filter(u => u.id !== user.id);
              this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
              this.showToast('Utilisateur supprimé', 'danger');
              this.loadStats();
            } catch(err) {}
          }
        }
      ]
    });
    await alert.present();
  }

  async blockReportedUser(report: any) {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/admin.php?action=block_user`, {
          user_id: report.reported_id
        })
      );
      this.showToast('Utilisateur bloqué suite au signalement ✅', 'warning');
      this.loadReports();
      this.loadStats();
    } catch(err) {}
  }

  dismissReport(report: any) {
    this.reports = this.reports.filter(r => r.id !== report.id);
    this.showToast('Signalement ignoré', 'medium');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/signin']);
  }

  private async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await t.present();
  }
}