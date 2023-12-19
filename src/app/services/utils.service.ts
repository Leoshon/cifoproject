import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController, ModalOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  modalCtrl = inject(ModalController);

  constructor() {}
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log(data);
      return data;
    }
  }
  dismisModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
  async takePhoto(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccionar foto',
      promptLabelPicture: 'Tomar foto',
    });
  }
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
}
