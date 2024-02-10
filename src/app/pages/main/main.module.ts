import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormulaService } from 'src/app/services/formula.service';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    SharedModule,
    HttpClientModule,
    TranslateModule
  ],
  exports: [
    SharedModule,
    HttpClientModule
  ],
  providers:[FormulaService],
  declarations: [MainPage]
})
export class MainPageModule {
  

}
