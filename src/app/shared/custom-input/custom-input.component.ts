import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateModuleService } from 'src/app/services/translate-module.service';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() label!: string;
  @Input() type!: string;
  @Input() controlName!: FormControl;
  @Input() icon!: string;
  @Input() autocomplete!: string;
  password!: boolean;
  hidePassword: boolean = true;
  constructor(public translateModuleService: TranslateModuleService) {}

  ngOnInit() {
    if (this.type == 'password') this.password = true;
  }
  showHidePassword() {
    this.hidePassword = !this.hidePassword;
    if (this.hidePassword) this.type = 'password';
    else this.type = 'text';
  }
}
