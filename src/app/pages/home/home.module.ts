import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AddUpdateEventComponent } from 'src/app/components/add-update-event/add-update-event.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule
  ],
  exports: [IonicModule,ReactiveFormsModule],
  declarations: [HomePage,AddUpdateEventComponent]
})
export class HomePageModule {}
