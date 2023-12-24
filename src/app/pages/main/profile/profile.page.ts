import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  utilsServ = inject(UtilsService);
  fireServ = inject(FireBaseService);
  constructor() { }

  ngOnInit() {
  }
  user(): User {
    return this.utilsServ.getFromLocalStorage('user');
  }
  async changeImage() {
    const image = await this.utilsServ.changeImage();
    console.log(image);
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
}
