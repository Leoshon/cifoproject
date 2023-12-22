import { Component, OnInit } from '@angular/core';
import {  FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //credentials!: FormGroup;
  /* isPassword!: boolean;
  hide:boolean=true;
  type!:string; */
 credentials= new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
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
  /*   this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    }); */
  /*   this.credentials = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }); */
    //this.type= 'password';
  }
  async login() {
    const loading = await this.utilsService.loading();
    await loading.present();
    const usuario= await this.authservice.login(this.credentials.value as User).then(async (res) => {
    
      console.log(res);
      return res; 
    
    }).catch((error) => {
      console.log(error);
      this.utilsService.presentToast({
        message: error.message,
        duration: 3000,
        color: 'primary',
        icon: 'alert-circle-outline',
        position: 'top'
      })
    }).finally(() => {
      loading.dismiss();

    });

    if (usuario!=null) {
      let data=this.utilsService.getFromLocalStorage('user');
      console.log(data);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } 
  
  }
/*   async register() {
    const loading = await this.loadingControler.create();
    await loading.present();
    const user = await this.authservice.register(this.credentials.value as User);
    await loading.dismiss();
    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Registration Failed', 'Please try again');
    }
    
  } */
/*   async showAlert(message: string, header: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  } */
 /*  togglePassword(){
    this.hide=!this.hide;
    if(this.hide){
      this.type="password";
  }else{
    this.type="text";
  } */
}

