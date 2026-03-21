import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dark-mode-settings',
  templateUrl: './dark-mode-settings.page.html',
  styleUrls: ['./dark-mode-settings.page.scss'],
  standalone: false
})
export class DarkModeSettingsPage implements OnInit {

  darkMode: boolean = false;

  constructor() {}

  ngOnInit() {
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', this.darkMode);
  }
 toggleTheme(event: any) {
  this.darkMode = event.detail.checked;
  document.body.classList.toggle('dark', this.darkMode); 
  localStorage.setItem('darkMode', String(this.darkMode));
}
}