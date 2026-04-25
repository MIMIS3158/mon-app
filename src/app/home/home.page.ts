/*import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  constructor(private menu: MenuController) {}

  ngOnInit() {
    this.menu.enable(false);
  }
}*/

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, AfterViewInit {

  @ViewChild('swiper') swiperRef: any;

  isLastSlide = false;
  currentIndex = 0;

  constructor(
    private menu: MenuController,
    private router: Router
  ) {}

  ngOnInit() {
    this.menu.enable(false);
  }

  /*ngAfterViewInit() {
    // Après 2.5s → passer automatiquement du splash vers slide 1
    setTimeout(() => {
      const swiper = this.swiperRef?.nativeElement?.swiper;
      if (swiper) {
        swiper.allowTouchMove = true; // activer swipe après splash
        swiper.slideNext();
      }
    }, 2500);
  }*/
ngAfterViewInit() {
  setTimeout(() => {
    const swiper = this.swiperRef?.nativeElement?.swiper;
    if (swiper) {
      // Listener fiable pour détecter les changements de slide
      swiper.on('slideChange', () => {
        this.currentIndex = swiper.activeIndex;
        this.isLastSlide = swiper.activeIndex === 3;
      });

      swiper.allowTouchMove = true;
      swiper.slideNext();
    }
  }, 2500);
}

// Tu peux garder onSlideChange() vide ou le supprimer


  // Appelé à chaque changement de slide
  onSlideChange() {
    const swiper = this.swiperRef?.nativeElement?.swiper;
    if (swiper) {
      this.currentIndex = swiper.activeIndex;
      // Splash=0, Slide1=1, Slide2=2, Slide3=3
      this.isLastSlide = swiper.activeIndex === 3;
    }
  }

  // Bouton Suivant ou Commencer
  nextSlide() {
    if (this.isLastSlide) {
      this.goToAuth();
    } else {
      const swiper = this.swiperRef?.nativeElement?.swiper;
      swiper?.slideNext();
    }
  }

  // Passer directement à signup
  goToAuth() {
    this.router.navigateByUrl('/signup', { replaceUrl: true });
  }
}