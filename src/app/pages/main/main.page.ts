import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  firebaseServ= inject(FireBaseService);
  utilsServ= inject(UtilsService);
  authService= inject(AuthService);
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
  user(): User {
    return this.utilsServ.getFromLocalStorage('user');
  }
  async logOut() {
    await this.authService.logout();
    this.utilsServ.routerNavigate('/login');
    
  }


}
