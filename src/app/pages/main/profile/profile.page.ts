import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from '../../../services/firebase.service';
import { UtilsService } from '../../../services/utils.service';
import { UpdateUserNameComponent } from '../../../components/update-user-name/update-user-name.component';
import  { TranslateModuleService } from '../../../services/translate-module.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  utilsServ = inject(UtilsService);
  fireServ = inject(FireBaseService);
  translate = inject(TranslateModuleService);
  usuario!: User;
  constructor() { }

  ngOnInit() {
   
  
  }
  ionViewWillEnter() {
    this.getUserInfo(this.user());
  }
  user(): User {
    return this.usuario = this.utilsServ.getFromLocalStorage('user');
  }
  async changeImage() {
    const image = await this.utilsServ.changeImage();
    if (image) {
      const loading = await this.utilsServ.loading();
      await loading.present();
      const result = await this.fireServ.uploadImage(image);
      await loading.dismiss();
      if (!result) {
        await this.utilsServ.showAlert(
          'Error',
          'Error updating profile picture'
        );
      }
    }
  }
  async updateUserName() {
   let success= await this.utilsServ.presentModal({
      component: UpdateUserNameComponent,
      cssClass: 'update-user-name',
      componentProps: {
        usuario: this.user(),
      }

    });
    if(success){
      this.usuario = this.utilsServ.getFromLocalStorage('user');
    }
  }
  async getUserInfo(usuario:User){
    const userDocRef = this.fireServ.getUserInfo(usuario);
    return await userDocRef;

  }
}
