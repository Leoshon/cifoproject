import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FireBaseService } from '../../../services/firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { User } from '../../../models/user.model';
import { UtilsService } from '../../../services/utils.service';
import { AddUpdateEventComponent } from 'src/app/components/add-update-event/add-update-event.component';
import { Events } from 'src/app/models/event.model';

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
  constructor(
    private utilsServ: UtilsService,
    private authService: AuthService,
    private routh: Router,
    private firebaseServ: FireBaseService,
    private loadingContr: LoadingController
  ) {}

  doRefresh(event: any) {
    this.getEvents();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  user(): User {
    console.log(this.utilsServ.getFromLocalStorage('user').uid);
    return this.utilsServ.getFromLocalStorage('user');
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
    const image = await this.utilsServ.changeImage();
    console.log(image);
    if (image) {
      const loading = await this.loadingContr.create();
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
        await this.utilsServ.showAlert('Evento eliminado', '');
      });
      await loading.dismiss();
    } catch (error) {
      console.log(error);
      this.utilsServ.showAlert('Error', 'Error eliminando el evento');
    } finally {
      this.getEvents();
    }
  }
  async confirmDelete(evento: Events) {
    await this.utilsServ.presentAlert({
      header: 'Confirmar',
      message: '¿Desea eliminar el evento?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Si',
          handler: () => {
            this.deleteEvent(evento);
          },
        },
      ],
    });
  }
  getEvents() {
    console.log(this.user().uid);
    let path = `users/${this.user().uid}/events`;
    this.loading = true;
    let sub = this.firebaseServ.getEvents(path).subscribe({
      next: (events: any) => {
        this.events = events;
        console.log(this.events);
        this.loading = false;
        sub.unsubscribe();
      },
    });
  }
}
