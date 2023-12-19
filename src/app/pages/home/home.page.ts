import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FireBaseService } from '../../services/firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { User } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';
import { AddUpdateEventComponent } from 'src/app/components/add-update-event/add-update-event.component';
import { Events } from 'src/app/models/event.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {
  profile = null as any;
  usuario!: User;
  titulo: string = '';
  events: Events[] = [];
  constructor(
    private utilsServ: UtilsService,
    private authService: AuthService,
    private routh: Router,
    private firebaseServ: FireBaseService,
    private loadingContr: LoadingController,
    private alertContr: AlertController
  ) {

  /*  this.firebaseServ.getUserInfo(this.user()).subscribe((user) => {
      this.usuario = user as User;
      console.log(this.usuario);
      
      
  });  */
   
  }

  user():User{
    console.log(this.utilsServ.getFromLocalStorage('user').uid);
    return  this.utilsServ.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    this.firebaseServ.getUserProfile().subscribe((profile) => {
      //console.log(profile);
      this.usuario = profile as User;
      console.log(this.usuario);
      this.utilsServ.saveInLocalStorage('user', this.usuario);
      this.getEvents();
    }); 
    
  }
  async logOut() {
    await this.authService.logout();
    this.routh.navigateByUrl('', { replaceUrl: true });
  }
  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Seleccionar foto',
      promptLabelPhoto: 'Seleccionar foto',
      promptLabelPicture: 'Tomar foto',
    });
    console.log(image);
    if (image) {
      const loading = await this.loadingContr.create();
      await loading.present();
      const result = await this.firebaseServ.uploadImage(image);
      await loading.dismiss();
      if (!result) {
        const alert = await this.alertContr.create({
          header: 'Error',
          message: 'Error updating profile picture',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
  async addUpdateEvent(evento?: Events) {
  let success = await this.utilsServ.presentModal({
      component: AddUpdateEventComponent,
      componentProps: {
        evento : evento,
      },
    });
    if (success) {
      this.getEvents();
    }

  }
  getEvents() {
   console.log(this.user().uid);
    let path = `users/${this.user().uid}/events`;
    let sub = this.firebaseServ.getEvents(path).subscribe({
      next: (events: any) => {
        this.events = events;
        console.log(this.events);
        sub.unsubscribe();
      },
    });
  }
}
