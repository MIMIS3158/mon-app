import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
  standalone: false
})
export class ConversationsPage implements OnInit, OnDestroy {

  private apiUrl = 'http://localhost/myApp/api';
  conversations: any[] = [];
  currentUserId: number = 0;
  private interval: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.currentUserId = parseInt(localStorage.getItem('userId') || '0');
    this.loadConversations();

    // ⭐ Rafraîchir toutes les 5 secondes
    this.interval = setInterval(() => {
      this.loadConversations();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  loadConversations() {
    this.http.get<any[]>(`${this.apiUrl}/get_conversations.php?user_id=${this.currentUserId}`)
      .subscribe({
        next: (data) => {
          this.conversations = data;
          this.checkNotifications();
        },
        error: () => {}
      });
  }

  checkNotifications() {
    this.http.get<any>(`${this.apiUrl}/get_unread_count.php?user_id=${this.currentUserId}`)
      .subscribe({
        next: (data) => {
          if (data.count > 0) {
            // ⭐ Notification badge
            document.title = `(${data.count}) Messages`;
          } else {
            document.title = 'Messages';
          }
        },
        error: () => {}
      });
  }

  ouvrirChat(conv: any) {
    this.router.navigate(['/chat'], {
      queryParams: {
        userId: conv.contact_id,
        projectId: 0
      }
    });
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.charAt(0) || '') + (prenom?.charAt(0) || '');
  }

  retour() {
    history.back();
  }
}