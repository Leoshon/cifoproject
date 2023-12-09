import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';   
import { AvatarService } from '../services/avatar.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null as any;

  constructor(private authService: AuthService,private routh: Router,private avatarService: AvatarService,private loadingContr: LoadingController,private alertContr: AlertController) {
    this.avatarService.getUserProfile().subscribe((profile) => {
      this.profile = profile;
      console.log(profile);
    });
  }
  async logOut(){
    await this.authService.logout();
    this.routh.navigateByUrl('', { replaceUrl: true });
    
 
  }
 async changeImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    console.log(image);
    if(image){
      const loading = await this.loadingContr.create();
      await loading.present();
      const result = await this.avatarService.uploadImage(image);
      await loading.dismiss();
  
    
    if(!result){
      const alert = await this.alertContr.create({
        header: 'Error',
        message: 'Error updating profile picture',
        buttons: ['OK'],
      });
      await alert.present();
    }

  }
}
}