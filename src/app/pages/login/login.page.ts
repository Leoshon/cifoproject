import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModuleService } from '../../services/translate-module.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  translateService = inject(TranslateService);
  translateModuleService = inject(TranslateModuleService);
  currentLanguage = '';
  labelEm = '';
  labelPass = '';
  credentials = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private authservice: AuthService,
    private router: Router,
    private utilsService: UtilsService
  ) {}
  get email() {
    return this.credentials.get('email');
  }
  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.currentLanguage = this.utilsService.getFromLocalStorage('language');
    this.currentLanguage
      ? this.translateModuleService.changeLanguage(this.currentLanguage)
      : this.translateModuleService.changeLanguage('ca');
  }
  async login() {
    const loading = await this.utilsService.loading();
    await loading.present();
    await this.authservice
      .login(this.credentials.value as User)
      .then(async (res) => {
        this.getUserInfo(res.user?.uid as string);
      })
      .catch((error) => {
        this.utilsService.presentToast({
          message: this.translateModuleService.get('access_denied'),
          duration: 3000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'middle',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
  async getUserInfo(uid: string) {
    const loading = await this.utilsService.loading();
    await loading.present();
    const user = await this.authservice
      .getDocument(`users/${uid}`)
      .then((user: User | any) => {
        this.utilsService.routerNavigate('/main/home');
        this.credentials.reset();
        this.utilsService.presentToast({
          message:
            this.translateModuleService.get('wellcome') + ' ' + user.nombre,
          duration: 2000,
          color: 'primary',
          icon: 'person-circle-outline',
          position: 'middle',
        });
      })
      .catch((error) => {
        this.utilsService.presentToast({
          message: error.message,
          duration: 3000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'middle',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
