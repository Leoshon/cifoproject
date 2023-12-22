import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { LoadingController, AlertController } from '@ionic/angular';
import { Events } from 'src/app/models/event.model';

@Component({
  selector: 'app-add-update-event',
  templateUrl: './add-update-event.component.html',
  styleUrls: ['./add-update-event.component.scss'],
})
export class AddUpdateEventComponent implements OnInit {
  utlisServ = inject(UtilsService);
  fireServ = inject(FireBaseService);
  loadCtrl = inject(LoadingController);
  alertCtrl = inject(AlertController);
  eventForm!: FormGroup;
  usuario = {} as User;
  @Input() evento?: Events;

  constructor(
    private fb: FormBuilder,
    private utilsServ: UtilsService
  ) {}
  get categoria() {
    return this.eventForm.get('categoria');
  }
  get descripcion() {
    return this.eventForm.get('descripcion');
  }
  get precio() {
    return this.eventForm.get('precio');
  }
  get pais() {
    return this.eventForm.get('pais');
  }
  get image() {
    return this.eventForm.get('image');
  }
  async ngOnInit() {
    this.eventForm = this.fb.group({
      id: [''],
      categoria: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      precio: [null, [Validators.required, Validators.min(0)]],
      pais: ['', [Validators.required, Validators.minLength(2)]],
      image: ['', [Validators.required]],
    });
    this.usuario = this.utilsServ.getFromLocalStorage('user');
    if (this.evento) {
      this.eventForm.setValue(this.evento);
    }
  }

  async closeModal() {
    await this.utlisServ.dismisModal();
  }
  async takePhoto() {
    const dataUrl = (await this.utlisServ.takePhoto('Agregar foto')).dataUrl;
    this.eventForm.get('image')?.setValue(dataUrl);
  }
  async submitEvent() {
    if (this.eventForm.valid) {
      if (this.evento) {
        await this.updateEvent();
      } else {
        await this.createEvent();
      }
    }
  }
  async createEvent() {
    let path = `users/${this.usuario.uid}/events`;
    const loading = await this.loadCtrl.create();
    await loading.present();
    try {
      let dataUrl = this.eventForm.get('image')?.value;
      const imagePath = `${this.usuario.uid}/${Date.now()}`;
      const imageUrl = await this.fireServ.uploadEventImage(
        imagePath,
        dataUrl
      );
      this.eventForm.get('image')?.setValue(imageUrl);
      delete this.eventForm.value.id;
      await this.fireServ
        .addDocument(path, this.eventForm.value)
        .then(async () => {
          await this.utlisServ.showAlert('Evento agregado', '');
        });
      this.utlisServ.dismisModal({ success: true});
      await loading.dismiss();
    } catch (error) {
      console.log(error);
    }
  }
  async updateEvent() {
    let path = `users/${this.usuario.uid}/events/${this.evento?.id}`;
    const loading = await this.loadCtrl.create();
    await loading.present();
    try {
      if (this.eventForm.get('image')?.value !== this.evento?.image) {
        let dataUrl = this.eventForm.get('image')?.value;
        const imagePath = await this.fireServ.getImgFilePath(
          this.evento?.image || ''
        );
        const imageUrl = await this.fireServ.uploadEventImage(
          imagePath,
          dataUrl
        );
        this.eventForm.get('image')?.setValue(imageUrl);
      }
      delete this.eventForm.value.id;
      await this.fireServ
        .updateEvent(path, this.eventForm.value)
        .then(async () => {
          await this.utlisServ.showAlert('Evento modfifcado', '');
        });
      this.utlisServ.dismisModal({ success: true});
      await loading.dismiss();
    } catch (error) {
      console.log(error);
    }
  }
/*   async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: '',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  } */
}
//await addDoc(collection(this.firestore,`users/${user?.uid}/events`), {imageUrl});
