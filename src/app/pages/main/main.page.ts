import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { TranslateModuleService } from 'src/app/services/translate-module.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  firebaseServ= inject(FireBaseService);
  utilsServ= inject(UtilsService);
  authService= inject(AuthService);
  translateModuleService= inject(TranslateModuleService);
  translateTitles(title: string) {
    switch (title) {
      case 'Home':
        return this.translateModuleService.get('home');
      case 'Profile':
        return this.translateModuleService.get('profile');
      case 'Quiz':
        return this.translateModuleService.get('quiz');
      case 'Otros':
        return this.translateModuleService.get('others');
      default:
        return title;
    
    }
  }
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
      title: 'Quiz',
      url: '/main/formulapage',
      icon: 'cash'
    },
    {
      title: 'Otros',
      url: '/main/all-members',
      icon: 'people-outline'
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
