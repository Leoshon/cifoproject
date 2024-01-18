import { Component, OnInit, inject } from '@angular/core';
import { TrivialComponent } from 'src/app/components/trivial/trivial.component';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { FormulaService } from 'src/app/services/formula.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-formulapage',
  templateUrl: './formulapage.page.html',
  styleUrls: ['./formulapage.page.scss'],
})
export class FormulapagePage implements OnInit {
  formulaService = inject(FormulaService);
  utilService = inject(UtilsService);
  fireService = inject(FireBaseService);

  datos: any = null;
  results: any = [];
  answers: any = [];
  usuario = {} as User;
  request: boolean = false;
  quizMoney: number = 0;
  constructor() {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.usuario = this.utilService.getFromLocalStorage('user');
  }

  async goToTrivial() {
    
    let success = await this.utilService.presentModal({
      component: TrivialComponent,
      componentProps: {
        usuario: this.usuario,
      },
    });
    
    if (success) {
      console.log('success');
    }
  }

}
