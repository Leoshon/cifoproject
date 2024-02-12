import { Component, OnInit, inject } from '@angular/core';
import { FireBaseService } from '../../../services/firebase.service';
import { User } from '../../../models/user.model';
import { UtilsService } from '../../../services/utils.service';
import { AddUpdateEventComponent } from '../../../components/add-update-event/add-update-event.component';
import { GetCommentsComponent } from '../../../components/get-comments/get-comments.component';
import { Events } from '../../../models/event.model';
import { TranslateModuleService } from '../../../services/translate-module.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null as any;
  usuario!: User;
  titulo: string = '';
  events: Events[] = [];
  loading: boolean = false;
  members: any[] = [];
  translate = inject(TranslateModuleService);
  constructor(
    private utilsServ: UtilsService,
    private firebaseServ: FireBaseService,
   
  ) {}

  doRefresh(event: any) {
    this.getEvents();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  user(): User {
    return this.utilsServ.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    this.firebaseServ.getUserProfile().subscribe((profile) => {
      this.usuario = profile as User;
      this.utilsServ.saveInLocalStorage('user', this.usuario);
      this.getEvents();
      
    });
  }
  async changeImage() {
    const image = await this.utilsServ.changeImage();
    console.log(image);
    if (image) {
      const loading = await this.utilsServ.loading();
      await loading.present();
      const result = await this.firebaseServ.uploadImage(image);
      await loading.dismiss();
      if (!result) {
        await this.utilsServ.showAlert(
          'Error',
          'Error updating profile picture'
        );
      }
    }
  }
  async addUpdateEvent(evento?: Events) {
    let success = await this.utilsServ.presentModal({
      component: AddUpdateEventComponent,
      componentProps: {
        evento: evento,
      },
    });
    if (success) {
      this.getEvents();
    }
  }
  async deleteEvent(evento: Events) {
    let path = `users/${this.user().uid}/events/${evento.id}`;
    const loading = await this.utilsServ.loading();
    await loading.present();

    try {
      let imagePath = await this.firebaseServ.getImgFilePath(evento.image);
      await this.firebaseServ.deleteFile(imagePath);
      await this.firebaseServ.deleteEvent(path, evento).then(async () => {
        await this.utilsServ.showAlert(this.translate.get('deleted'), '');
      });
      await loading.dismiss();
    } catch (error) {
      this.utilsServ.showAlert('Error', 'Error eliminando el evento');
    } finally {
      this.getEvents();
    }
  }
  async confirmDelete(evento: Events) {
    await this.utilsServ.presentAlert({
      header: this.translate.get('confirm'),
      message: this.translate.get('sure'),
      mode: 'ios',
      buttons: [
        {
          text: this.translate.get('no'),
          role: 'cancel',
        },
        {
          text: this.translate.get('yes'),
          handler: () => {
            this.deleteEvent(evento);
          },
        },
      ],
    });
  }
  getEvents() {
    let path = `users/${this.user().uid}/events`;
    this.loading = true;
    let sub = this.firebaseServ.getEvents(path).subscribe({
      next: (events: any) => {
        this.events = events;
        this.loading = false;
        sub.unsubscribe();
      },
    });
  }

  callModal(id:any){
    this.utilsServ.presentModal({
      component: GetCommentsComponent,
      componentProps: {
        id: id,
        uid: this.user().uid,
      },
    });
  }

}
