import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  AlertOptions,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateModuleService } from './translate-module.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  modalCtrl = inject(ModalController);
  loadingCtrl = inject(LoadingController);
  alertCtrl = inject(AlertController);
  toastController = inject(ToastController);
  router = inject(Router);
  translateModuleService = inject(TranslateModuleService);
  constructor() {}
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  }
  async loading() {
    return this.loadingCtrl.create({
      message: this.translateModuleService.get('loading'),
      spinner: 'crescent',
      showBackdrop: true,
      translucent: true,
    });
  }
  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
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
      promptLabelHeader: this.translateModuleService.get('select_foto'),
      promptLabelPhoto: this.translateModuleService.get('select_foto'),
      promptLabelPicture: this.translateModuleService.get('take_foto'),
    });
  }
  async changeImage() {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: this.translateModuleService.get('select_foto'),
      promptLabelPhoto: this.translateModuleService.get('select_foto'),
      promptLabelPicture: this.translateModuleService.get('take_foto'),
    });
  }
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
  clearLocalStorage() {
    localStorage.clear();
  }
  async showAlert(message: string, header: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }
  routerNavigate(url: string) {
    return this.router.navigateByUrl(url, { replaceUrl: true });
  }
  shaffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
