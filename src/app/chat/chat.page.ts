import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit, OnDestroy {

  private apiUrl = 'http://localhost/myApp/api/messages.php';

  messages: any[] = [];
  newMessage: string = '';
  currentUserId: number = 0;
  receiverId: number = 0;
  projectId: number = 0;
  private interval: any;
  receiverName: string = '';
receiverPhoto: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUserId = parseInt(localStorage.getItem('userId') || '0');

    this.route.queryParams.subscribe(params => {
      this.receiverId = params['userId'] ? parseInt(params['userId']) : 0;
      this.projectId  = params['projectId'] ? parseInt(params['projectId']) : 0;
      this.loadMessages();
      this.loadReceiver();
    });

   
    this.interval = setInterval(() => {
      this.loadMessages();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  loadMessages() {
    if (!this.currentUserId || !this.receiverId) return;

    this.http.get<any[]>(
      `${this.apiUrl}?sender_id=${this.currentUserId}&receiver_id=${this.receiverId}`
    ).subscribe({
      next: (data) => { this.messages = data; },
      error: () => {}
    });
  }

  envoyerMessage() {
    if (!this.newMessage.trim()) return;

    const body = {
      sender_id:   this.currentUserId,
      receiver_id: this.receiverId,
      project_id:  this.projectId,
      message:     this.newMessage
    };

    this.http.post(this.apiUrl, body).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages();
      },
      error: () => {}
    });
  }

  isMine(msg: any): boolean {
    return msg.sender_id == this.currentUserId;
  }
loadReceiver() {
  this.http.get<any>(
    `http://localhost/myApp/api/get_user.php?id=${this.receiverId}`
  ).subscribe({
    next: (user) => {
      this.receiverName = (user.Prenom || '') + ' ' + (user.Nom || '');
      this.receiverPhoto = user.photo || '';  
      console.log('photo:', this.receiverPhoto); 
    },
    error: () => {}
  });
}
}