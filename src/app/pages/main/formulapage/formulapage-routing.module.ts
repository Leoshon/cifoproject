import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulapagePage } from './formulapage.page';

const routes: Routes = [
  {
    path: '',
    component: FormulapagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulapagePageRoutingModule {}
