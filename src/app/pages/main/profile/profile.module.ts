import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateUserNameComponent } from 'src/app/components/update-user-name/update-user-name.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule
    
  ],
  exports: [IonicModule,ReactiveFormsModule],
  declarations: [ProfilePage, UpdateUserNameComponent]
})
export class ProfilePageModule {
}
