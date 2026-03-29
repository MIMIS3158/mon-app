import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
  standalone: false,
})
export class ConversationsPage implements OnInit, OnDestroy {
  private apiUrl = environment.apiUrl;
  conversations: any[] = [];
  filteredConversations: any[] = [];
  searchTerm: string = '';
  currentUserId: number = 0;
  onlineUsers: number[] = [];
  private interval: any;

  private gradients = ['linear-gradient(135deg, #667eea, #764ba2)'];
  constructor(
    private router: Router,
    private http: HttpClient,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.currentUserId = parseInt(localStorage.getItem('userId') || '0');
    this.loadConversations();
    this.loadOnlineUsers();
    this.interval = setInterval(() => {
      this.loadConversations();
    }, 5000);
  }
  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
  loadConversations() {
    /*this.http
      .get<
        any[]
      >(`${this.apiUrl}/get_conversations.php?user_id=${this.currentUserId}`)*/
      this.http.get<any[]>(`${this.apiUrl}/get_conversations.php`, {
  params: { user_id: this.currentUserId }
})
      .subscribe({
        next: (data) => {
          this.conversations = data;
          this.onSearch();
        },
        error: () => {},
      });
  }
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredConversations = this.conversations;
      return;
    }
    this.filteredConversations = this.conversations.filter(
      (c) =>
        (c.contact_nom?.toLowerCase() || '').includes(term) ||
        (c.contact_prenom?.toLowerCase() || '').includes(term) ||
        (c.last_message?.toLowerCase() || '').includes(term),
    );
  }
  ouvrirChat(conv: any) {
    this.router.navigate(['/chat'], {
      queryParams: {
        userId: conv.contact_id,
        projectId: 0,
      },
    });
  }
  getInitiales(nom: string, prenom: string): string {
    return ((prenom?.charAt(0) || '') + (nom?.charAt(0) || '')).toUpperCase();
  }
  getGradient(id: number): string {
    return this.gradients[id % this.gradients.length];
  }
  retour() {
    history.back();
  }
  loadOnlineUsers() {
    this.http.get<any[]>(`${this.apiUrl}/online_users.php`).subscribe({
      next: (data) => {
        this.onlineUsers = data.map((u) => u.user_id);
      },
      error: () => {},
    });
  }
  isOnline(userId: number): boolean {
    return this.onlineUsers.includes(Number(userId));
  }
  
    async supprimerConversation(conv: any, event?: Event) {
    if (event) event.stopPropagation();

   /* const confirmed = confirm(
      `Supprimer la conversation avec ${conv.contact_prenom} ${conv.contact_nom} ?`,
    );*/
    const confirmed = await this.alertsService.confirm(
    `Supprimer la conversation avec ${conv.contact_prenom} ${conv.contact_nom} ?`
  );
    if (!confirmed) return;

   /* this.http
      .delete(
        `${this.apiUrl}/delete_conversation.php?user_id=${this.currentUserId}&contact_id=${conv.contact_id}`,
      )*/
     this.http.delete(`${this.apiUrl}/delete_conversation.php`, {
  params: { user_id: this.currentUserId, contact_id: conv.contact_id }
})
      .subscribe({
        next: () => {
          this.conversations = this.conversations.filter(
            (c) => c.contact_id !== conv.contact_id,
          );
          this.filteredConversations = this.filteredConversations.filter(
            (c) => c.contact_id !== conv.contact_id,
          );
        },
        error: () => {
          this.alertsService.alert('Erreur lors de la suppression');
        },
      });
  
    }
    
}
