import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormulapagePageRoutingModule } from './formulapage-routing.module';

import { FormulapagePage } from './formulapage.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrivialComponent } from 'src/app/components/trivial/trivial.component';
import { HttpClientModule } from '@angular/common/http';
import { FormulaService } from 'src/app/services/formula.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormulapagePageRoutingModule,
    SharedModule,
    HttpClientModule
    
  ],
  exports: [
    SharedModule,
    
  ],
  providers:[FormulaService],
  declarations: [FormulapagePage,TrivialComponent]
})
export class FormulapagePageModule {}
