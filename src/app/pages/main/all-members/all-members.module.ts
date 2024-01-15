import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllMembersPageRoutingModule } from './all-members-routing.module';

import { AllMembersPage } from './all-members.page';
import { MembersStatsComponent } from 'src/app/components/members-stats/members-stats.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllMembersPageRoutingModule,
    SharedModule
  ],
  exports: [IonicModule],
  declarations: [AllMembersPage,MembersStatsComponent]
})
export class AllMembersPageModule {}