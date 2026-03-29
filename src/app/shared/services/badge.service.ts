import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface BadgeData {
  messages: number;
  notifications: number;
  en_cours: number;
  termines: number;
  evaluations: number;
}

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBadges() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    return this.http.get<BadgeData>(`${this.apiUrl}/badge.php`, {
      params: { userId: userId!, role: role! }
    });
  }
}