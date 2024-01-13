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


  constructor() { }

  ngOnInit() {}
 
   
  }



