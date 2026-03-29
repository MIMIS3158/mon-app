import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { AlertsService } from '../shared/services/alerts.service';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { Router } from '@angular/router';

//import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit, OnDestroy {
  private userUrl = environment.apiUrl + '/get_user.php';
  private messageUrl = environment.apiUrl + '/messages.php';
   private apiUrl = environment.apiUrl;

  messages: any[] = [];
  newMessage: string = '';

  currentUserId: number = 0;
  receiverId: number = 0;
  projectId: number = 0;
  private interval: any;
  receiverName: string = '';
  receiverPhoto: string = '';
  @ViewChild(IonContent) content!: IonContent;
  isBlocked: boolean = false;
  iAmBlocker: boolean = false;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private alertsService: AlertsService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController, 
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUserId = parseInt(localStorage.getItem('userId') || '0');

    this.route.queryParams.subscribe((params) => {
      this.receiverId = params['userId'] ? parseInt(params['userId']) : 0;
      this.projectId = params['projectId'] ? parseInt(params['projectId']) : 0;
      this.loadMessages();
      this.loadReceiver();
      this.checkIfBlocked();
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
          last_msg_id: this.messages?.[this.messages?.length - 1]?.id,
        },
      }),
    ).then((data) => {
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
      message: this.newMessage,
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
   /* this.http.get<any>(`${this.userUrl}?id=${this.receiverId}`)
   */  this.http.get<any>(this.userUrl, {
  params: { id: this.receiverId }
}).subscribe({
      next: (user) => {
        this.receiverName = (user.Prenom || '') + ' ' + (user.Nom || '');
        this.receiverPhoto = user.photo || '';
        console.log('photo:', this.receiverPhoto);
      },
      error: () => {},
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
async showContactInfo() {
  const modal = await this.modalController.create({
    component: ContactInfoComponent,
    componentProps: {
      name: this.receiverName,
      photo: this.receiverPhoto,
      userId: this.receiverId
    }
  });
  
  await modal.present();
  
  const { data } = await modal.onDidDismiss();
if (data?.deleted || data?.blocked) {
  this.router.navigate(['/conversations']);
}
}
async openActions() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Options',
    buttons: [
      { 
        text: 'Galerie', 
        icon: 'images-outline', 
        handler: () => { 
          document.getElementById('galleryInput')?.click(); 
        }
      },
      { 
        text: 'Fichier', 
        icon: 'document-outline', 
        handler: () => { 
          document.getElementById('fileInput')?.click(); 
        }
      },
      { 
        text: 'Localisation', 
        icon: 'location-outline', 
        handler: () => { this.envoyerLocalisation(); }
      },
      { text: 'Annuler', role: 'cancel' }
    ]
  });
  await actionSheet.present();
}
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('sender_id', this.currentUserId.toString());
  formData.append('receiver_id', this.receiverId.toString());
  formData.append('project_id', this.projectId.toString());
  formData.append('message', '');
  formData.append('fichier', file);

  this.http.post(this.messageUrl, formData).subscribe({
    next: () => {
      this.loadMessages();
    },
    error: () => {
      this.alertsService.alert('Erreur lors de l\'envoi du fichier');
    }
  });
}
checkIfBlocked() {
  const currentUserId = localStorage.getItem('userId');
  

  this.http.get<any>(`${this.apiUrl}/block_user.php`, {
    params: { blocker_id: currentUserId!, blocked_id: this.receiverId }
  }).subscribe({
    next: (data) => {
      this.isBlocked = data.blocked;
    }
  });

  
  this.http.get<any>(`${this.apiUrl}/block_user.php`, {
    params: { blocker_id: currentUserId!, blocked_id: this.receiverId, check_mine: '1' }
  }).subscribe({
    next: (data) => {
      this.iAmBlocker = data.blocked;
    }
  });
}

async debloquer() {
  const currentUserId = localStorage.getItem('userId');
  this.http.delete(`${this.apiUrl}/block_user.php`, {
    params: { blocker_id: currentUserId!, blocked_id: this.receiverId }
  }).subscribe({
    next: () => {
      this.isBlocked = false;
    },
    error: () => {}
  });
}
async envoyerLocalisation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const locMessage = `https://maps.google.com/?q=${lat},${lng}`;
      
      const body = {
        sender_id: this.currentUserId,
        receiver_id: this.receiverId,
        project_id: this.projectId,
        localisation: locMessage
      };

      this.http.post(this.messageUrl, body).subscribe({
        next: () => this.loadMessages(),
        error: () => this.alertsService.alert('Erreur localisation')
      });
    });
  } else {
    this.alertsService.toast('Géolocalisation non supportée');
  }
}
ouvrirLocalisation(url: string) {
  window.open(url, '_blank');
}
openCamera() {
  document.getElementById('cameraInput')?.click();
}
}
