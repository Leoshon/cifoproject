import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  pages = [
    {
      title: 'Home',
      url: '/main/home',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: '/main/profile',
      icon: 'person'
    },
    {
      title: 'Logout',
      url: '/login',
      icon: 'log-out'
    }
  ]
  router = inject(Router);
  currentPath: string = '';
  constructor() { }

  ngOnInit() {
    this.router.events.subscribe((event:any) => {
      if(event?.url) {
        this.currentPath = event.url;
      }
    });
  }

}
