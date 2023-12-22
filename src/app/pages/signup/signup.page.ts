import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials!: FormGroup;
  isPassword!: boolean;
  hide: boolean = true;
  type!: string;

  constructor(
    private fb: FormBuilder,
    private loadingControler: LoadingController,
    private alertController: AlertController,
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
    return this.credentials.get('nombre');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      uid: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.type = 'password';
  }
  async signUp() {
    const loading = await this.loadingControler.create();
    await loading.present();
    const user = await this.authservice
      .register(this.credentials.value as User)
      .then(async (res) => {
      await this.authservice.updateUser(this.credentials.value as User);
        console.log(res?.user?.uid);
        this.credentials.value.uid = res?.user?.uid;
        await this.setUserInfo(this.credentials.value.uid as string);
       // await this.getUserInfo(this.credentials.value.uid as string);
        this.utilsService.showAlert('Bienvenido', `${this.credentials.value.nombre}`);
      })
      .catch((err) => {
        this.utilsService.showAlert('Registration Failed', 'Please try again');
      });
    await loading.dismiss();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  async setUserInfo(uid: string) {
    const loading = await this.loadingControler.create();
    await loading.present();
    await this.authservice.setDocument(`users/${uid}`, {
      nombre: this.credentials.value.nombre,
      email: this.credentials.value.email,
      uid: uid,

    });
    console.log(this.credentials.value);
    this.utilsService.saveInLocalStorage('user',this.credentials.value);
    
    await loading.dismiss();
  }
  async getUserInfo(uid: string) {
    const loading = await this.loadingControler.create();
    await loading.present();
    const user = await this.authservice
      .getDocument(`users/${uid}`)
      .then((res) => {
        console.log(res);
        
      });
    await loading.dismiss();
  }
/*   async showAlert(message: string, header: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  } */
  togglePassword() {
    this.hide = !this.hide;
    if (this.hide) {
      this.type = 'password';
    } else {
      this.type = 'text';
    }
  }
}
