import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FireBaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { TranslateModuleService } from '../../services/translate-module.service';

@Component({
  selector: 'app-update-user-name',
  templateUrl: './update-user-name.component.html',
  styleUrls: ['./update-user-name.component.scss'],
})
export class UpdateUserNameComponent implements OnInit {
  @Input() usuario!: any;
  get image() {
    return this.form.get('image');
  }
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    image: new FormControl(''),
  });
  constructor() {}
  utilsServ = inject(UtilsService);
  fireServ = inject(FireBaseService);
  translate = inject(TranslateModuleService);
  ngOnInit() {}
  async closeModal() {
    await this.utilsServ.dismisModal();
  }
  async changeImage() {
    const image = (await this.utilsServ.takePhoto('')).dataUrl;
    this.form.get('image')?.setValue(image ?? '');
  }
  async updateUser() {
    if (this.form.invalid) {
      return;
    }
    const loading = await this.utilsServ.loading();
    await loading.present();
    this.usuario.nombre = this.form.controls.name.value;
    this.usuario.imageUrl = this.form.controls.image.value;
    const result = await this.fireServ
      .updateUser(this.usuario)
      .then(async () => {
        await this.utilsServ.showAlert('Usuario actualizado', '');
      });
    await loading.dismiss();
    this.utilsServ.saveInLocalStorage('user', this.usuario);
    await this.utilsServ.dismisModal({ success: true });
  }
}
