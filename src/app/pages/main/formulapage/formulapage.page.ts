import { Component, OnInit, inject } from '@angular/core';
import { TrivialComponent } from '../../../components/trivial/trivial.component';
import { User } from '../../../models/user.model';
import { FireBaseService } from '../../../services/firebase.service';
import { FormulaService } from '../../../services/formula.service';
import { UtilsService } from '../../../services/utils.service';
import { TranslateModuleService } from '../../../services/translate-module.service';

@Component({
  selector: 'app-formulapage',
  templateUrl: './formulapage.page.html',
  styleUrls: ['./formulapage.page.scss'],
})
export class FormulapagePage implements OnInit {
  formulaService = inject(FormulaService);
  utilService = inject(UtilsService);
  fireService = inject(FireBaseService);
  translate = inject(TranslateModuleService);

  datos: any = null;
  results: any = [];
  answers: any = [];
  usuario = {} as User;
  request!: boolean;
  quizMoney: number = 0;
  constructor() {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.usuario = this.utilService.getFromLocalStorage('user');
    if (this.usuario.quizPoints == 0) {
      this.request = false;
      this.goToEvents();
    } else {
      this.request = true;
    }
  }
  async goToEvents() {
    await this.utilService.presentAlert({
      header: this.translate.get('no_points'),
      message: this.translate.get('create_event'),
      mode: 'ios',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.utilService.routerNavigate('/main/home');
          },
        },
      ],
    });
  }

  async goToTrivial() {
    if (this.usuario.quizPoints == 0) {
      this.goToEvents();
    } else {
      let success = await this.utilService.presentModal({
        component: TrivialComponent,
        componentProps: {
          usuario: this.usuario,
        },
      });
    }
  }
}
