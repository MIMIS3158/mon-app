import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.page.html',
  styleUrls: ['./signout.page.scss'],
  standalone: false,
})
export class DeconnexionPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {} /*
signout(){
  localStorage.clear();
  this.router.navigate(['/home']);
}*/
}
