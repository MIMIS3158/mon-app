import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-publish-workshop',
  templateUrl: './publish-workshop.page.html',
  styleUrls: ['./publish-workshop.page.scss'],
  standalone: false
})
export class PublishWorkshopPage {   

  data: any = {
    title: '',
    description: '',
    level: '',
    image_url: '',
    video_url: '',
    is_free: true,
    price: 0,
    user_id: 1
  };

  constructor(private http: HttpClient) {}

  publish() {
    this.http.post('http://localhost/api/workshops.php', this.data)
      .subscribe(() => {
        alert("Publié avec succès 🚀");
      });
  }
}