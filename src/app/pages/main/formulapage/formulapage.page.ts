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
 formulaService= inject(FormulaService);
 utilService= inject(UtilsService);
 fireService = inject(FireBaseService);
 datos: any=null;
 results: any=[];
 answers: any=[];
 usuario = {} as User;
 request: boolean = false;
 quizMoney: number = 0;
  constructor() { }

  ngOnInit() {
    //this.getSeazon();
    //this.getWeather();
    this.usuario = this.utilService.getFromLocalStorage('user');
    if(this.usuario.quizPoints == null){
      this.usuario.quizPoints = 10;
    }else{
      this.usuario.quizPoints += 10;
    }
    
  
  }
  ionViewWillEnter(){

  }
 /*  getSeazon(){
    this.formulaService.getSeazon().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    })
   
  } */
  /* sendRequest(){
    this.request=true;
      this.formulaService.getRequest().subscribe({
      next: (data) => {
        console.log(data);
        this.datos=data;
        console.log(this.datos.results);
        this.results=this.datos.results;
        this.answers=[...this.results[0].incorrect_answers,this.results[0].correct_answer];
        console.log(this.answers);
        this.answers=this.utilService.shaffle(this.answers);
        console.log(this.answers);
        
        
        
        
      },
      error: (error) => {
        console.log(error);
      },
      
      
    })
   
  } */
 /* async getChoise(choise:any,eTarget:any){
    if (choise == this.results[0].correct_answer) {
      eTarget.target.classList.add("correct");
      this.utilService.presentToast({
        message: `Enhorabuena ${this.usuario.nombre}! Has ganado 10 centimos!`,
        duration: 3000,
        color: 'primary',
        icon: 'person-circle-outline',
        position: 'middle',
      });
      if(this.usuario.quizPoints){
        this.usuario.quizPoints += 10;
        this.utilService.saveInLocalStorage('user', this.usuario);
        this.quizMoney = this.usuario.quizPoints/10;
      }
      this.fireService.updateUser(this.usuario);
    } else {
      console.log("incorrect");
      eTarget.target.classList.add("incorrect");
    }
    const loading = await this.utilService.loading();
    await loading.present();
    await loading.dismiss();
    this.request=false;
  } */
  async goToTrivial() {
    let success = await this.utilService.presentModal({
      component: TrivialComponent,
      componentProps: {
      usuario: this.usuario,
      },
    });
    if (success) {
      console.log("success");
    }
  } 

}
