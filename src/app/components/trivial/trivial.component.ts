import { Component, Input, OnInit, inject } from '@angular/core';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormulaService } from 'src/app/services/formula.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-trivial',
  templateUrl: './trivial.component.html',
  styleUrls: ['./trivial.component.scss'],
})
export class TrivialComponent  implements OnInit {
  formulaService= inject(FormulaService);
  utilService= inject(UtilsService);
  fireService = inject(FireBaseService);
  timer: any;
  maxtime: number = 10;
  datos: any=null;
 results: any=[];
 answers: any=[];
  request: boolean = false;
  @Input() usuario!: User;


  constructor() { }

  ngOnInit() {
    
    console.log(this.usuario);
  }
  setTimer(){
    this.timer = setInterval(() => {
      this.maxtime -= 1;
      if (this.maxtime == 0) {
        this.utilService.dismisModal({ success: false});
      }
    }, 1000);
  }
 async sendRequest(){
    this.request=true;
    this.setTimer();
      this.formulaService.getRequest().subscribe({
      next: (data) => {
        console.log(data);
        this.datos=data;
        console.log(this.datos.results);
        this.results=this.datos.results;
        this.answers=[...this.results[0].incorrect_answers,this.results[0].correct_answer];
        this.answers=this.utilService.shaffle(this.answers);
        console.log(this.answers);
        
        
        
        
      },
      error: (error) => {
        console.log(error);
      },
      
      
    })
   
  }
   getChoise(choise:any,eTarget:any){
    
    clearInterval(this.timer);
    if (choise == this.results[0].correct_answer) {
      eTarget.target.classList.add("correct");
      this.utilService.presentToast({
        message: `Enhorabuena ${this.usuario.nombre}! Has ganado 10 centimos!`,
        duration: 3000,
        color: 'primary',
        icon: 'happy-outline',
        position: 'middle',
      });
      if(this.usuario.quizPoints){
        this.usuario.quizPoints += 10;
        this.utilService.saveInLocalStorage('user', this.usuario);
       
      }
      this.fireService.updateUser(this.usuario);
      
    } else {
      console.log("incorrect");
      eTarget.target.classList.add("incorrect");
      this.utilService.presentToast({
        message: `Lo siento ${this.usuario.nombre}! Has perdido 10 centimos!`,
        duration: 3000,
        color: 'danger',
        icon: 'sad-outline',
        position: 'middle',
      });
      if(this.usuario.quizPoints){
        this.usuario.quizPoints -= 10;
        this.utilService.saveInLocalStorage('user', this.usuario);
        
      }
      this.fireService.updateUser(this.usuario);
      
    }
    
    this.utilService.dismisModal({ success: true});
    
  }
   
  }


