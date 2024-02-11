import { Component, Input, OnInit, inject } from '@angular/core';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormulaService } from 'src/app/services/formula.service';
import { User } from 'src/app/models/user.model';
import { TranslateModuleService } from '../../services/translate-module.service';

@Component({
  selector: 'app-trivial',
  templateUrl: './trivial.component.html',
  styleUrls: ['./trivial.component.scss'],
})
export class TrivialComponent implements OnInit {
  formulaService = inject(FormulaService);
  utilService = inject(UtilsService);
  fireService = inject(FireBaseService);
  translate = inject(TranslateModuleService);
  timer: any;
  maxtime: number = 10;
  datos: any = null;
  results: any = [];
  answers: any = [];
  request: boolean = false;
  @Input() usuario!: User;

  constructor() {}

  ngOnInit() {
    console.log(this.usuario);
    this.utilService.loading().then((load) => {
      load.present();
      setTimeout(() => {
        load.dismiss();
      }, 1000);
    });
  }
  setTimer() {
    this.timer = setInterval(() => {
      this.maxtime -= 1;
      if (this.maxtime == 0) {
        this.utilService.presentToast({
          message: this.translate.get('lost') + ' ' + this.usuario.nombre,
          duration: 3000,
          color: 'danger',
          icon: 'sad-outline',
          position: 'middle',
        });
        this.utilService.dismisModal({ success: false });
        if (this.usuario.quizPoints != 0 && this.usuario.quizPoints) {
          this.usuario.quizPoints -= 10;
          this.utilService.saveInLocalStorage('user', this.usuario);
          this.fireService.updateUser(this.usuario);
        } else {
          this.usuario.quizPoints = 0;
          this.utilService.saveInLocalStorage('user', this.usuario);
          this.fireService.updateUser(this.usuario);
        }
      }
    }, 1000);
  }
  /*    sanitize(txt: string) {
    txt.replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#039;/g, "'")
    .replace(/&deg;/g, "°")
    .replace(/&eacute;/g, "é")
    .replace(/&aacute;/g, "á")
    return txt;
  } */
  async sendRequest() {
    this.request = true;
    this.setTimer();
    this.formulaService.getRequest().subscribe({
      next: (data) => {
        console.log(data);
        this.datos = data;
        console.log(this.datos.results);
        this.datos.results[0].question = this.datos.results[0].question
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#039;/g, "'")
          .replace(/&deg;/g, '°');
        this.datos.results[0].correct_answer =
          this.datos.results[0].correct_answer
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#039;/g, "'")
            .replace(/&deg;/g, '°');
        for (
          let i = 0;
          i < this.datos.results[0].incorrect_answers.length;
          i++
        ) {
          this.datos.results[0].incorrect_answers[i] =
            this.datos.results[0].incorrect_answers[i]
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#039;/g, "'")
              .replace(/&deg;/g, '°');
        }
        console.log(this.datos.results[0].question);
        this.results = this.datos.results;
        console.log(this.results[0].question);
        //this.results[0].question =  this.sanitize(this.results[0].question);

        this.answers = [
          ...this.results[0].incorrect_answers,
          this.results[0].correct_answer,
        ];

        this.answers = this.utilService.shaffle(this.answers);
        console.log(this.answers);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getChoise(choise: any, eTarget: any) {
    clearInterval(this.timer);
    if (choise == this.results[0].correct_answer) {
      eTarget.target.classList.add('correct');
      this.utilService.presentToast({
        message:  this.usuario.nombre + ' ' + this.translate.get('won'),
        duration: 3000,
        color: 'primary',
        icon: 'happy-outline',
        position: 'middle',
      });
      if (this.usuario.quizPoints || this.usuario.quizPoints == 0) {
        this.usuario.quizPoints += 10;
        this.utilService.saveInLocalStorage('user', this.usuario);
        this.fireService.updateUser(this.usuario);
      }
    } else {
      console.log('incorrect');
      eTarget.target.classList.add('incorrect');
      this.utilService.presentToast({
        message: this.translate.get('lost') + ' ' + this.usuario.nombre,
        duration: 3000,
        color: 'danger',
        icon: 'sad-outline',
        position: 'middle',
      });
      if (this.usuario.quizPoints && this.usuario.quizPoints != 0) {
        this.usuario.quizPoints -= 10;
        this.utilService.saveInLocalStorage('user', this.usuario);
        this.fireService.updateUser(this.usuario);
      } else {
        this.usuario.quizPoints = 0;
        this.utilService.saveInLocalStorage('user', this.usuario);
        this.fireService.updateUser(this.usuario);
        this.request = true;
      }
    }

    this.utilService.dismisModal({ success: true });
  }
}
