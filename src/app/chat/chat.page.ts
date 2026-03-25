import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { AlertsService } from '../shared/services/alerts.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit, OnDestroy {
  private userUrl = environment.apiUrl + '/get_user.php';
  private messageUrl = environment.apiUrl + '/messages.php';

  messages: any[] = [];
  newMessage: string = '';

  currentUserId: number = 0;
  receiverId: number = 0;
  projectId: number = 0;
  private interval: any;
  receiverName: string = '';
  receiverPhoto: string = '';
  @ViewChild(IonContent) content!: IonContent;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private alertsService: AlertsService
  ) {}

  ngOnInit() {
    this.currentUserId = parseInt(localStorage.getItem('userId') || '0');

    this.route.queryParams.subscribe(params => {
      this.receiverId = params['userId'] ? parseInt(params['userId']) : 0;
      this.projectId = params['projectId'] ? parseInt(params['projectId']) : 0;
      this.loadMessages();
      this.loadReceiver();
    });

    this.interval = setInterval(() => {
      this.loadMessages();
    }, 3000);
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  loadMessages() {
    if (!this.currentUserId || !this.receiverId) return;

    var last_msg_id = this.messages?.[this.messages?.length - 1]?.id;

    firstValueFrom(
      this.http.get<any[]>(`${this.messageUrl}`, {
        params: {
          sender_id: this.currentUserId,
          receiver_id: this.receiverId,
          last_msg_id: this.messages?.[this.messages?.length - 1]?.id
        }
      })
    ).then(data => {
      if (!data || data.length == 0) {
        return;
      }

      if (last_msg_id) {
        this.messages.push(data);
      } else {
        this.messages = data;
      }

      this.scrollToBottom();
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const body = {
      sender_id: this.currentUserId,
      receiver_id: this.receiverId,
      project_id: this.projectId,
      message: this.newMessage
    };

    firstValueFrom(this.http.post(this.messageUrl, body)).then(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }

  isMine(msg: any): boolean {
    return msg.sender_id == this.currentUserId;
  }

  loadReceiver() {
    this.http.get<any>(`${this.userUrl}?id=${this.receiverId}`).subscribe({
      next: user => {
        this.receiverName = (user.Prenom || '') + ' ' + (user.Nom || '');
        this.receiverPhoto = user.photo || '';
        console.log('photo:', this.receiverPhoto);
      },
      error: () => {}
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }

  comingSoon() {
    return this.alertsService.toast('Coming soon...');
  }
}
