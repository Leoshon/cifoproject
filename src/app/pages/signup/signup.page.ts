import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    uid: new FormControl(''),
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
  get nombre() {
    return this.credentials.get('name');
  }

  ngOnInit() {
  }
  async signUp() {
    if (this.credentials.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      const user = await this.authservice
        .register(this.credentials.value as User)
        .then(async (res) => {
          await this.authservice.updateUser(this.credentials.value as User);
          console.log(res?.user?.uid);
          this.credentials.value.uid = res?.user?.uid;
          await this.setUserInfo(this.credentials.value.uid as string);
          this.utilsService.showAlert(
            'Bienvenido',
            `${this.credentials.value.name}`
          );
        })
        .catch((err) => {
          this.utilsService.presentToast({
            message: err.message,
            duration: 2000,
            color: 'danger',
          });
        })
        .finally(() => {
          loading.dismiss();
          this.utilsService.routerNavigate('/main/home');
        });
    }
  }


  async setUserInfo(uid: string) {
    if (this.credentials.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      await this.authservice
        .setDocument(`users/${uid}`, {
          nombre: this.credentials.value.name,
          email: this.credentials.value.email,
          uid: uid,
        })
        .then(async (res) => {
          this.utilsService.saveInLocalStorage('user', this.credentials.value);
        })
        .catch((err) => {
          this.utilsService.showAlert(
            'Something went wrong...',
            'Please try again'
          );
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
 
}
