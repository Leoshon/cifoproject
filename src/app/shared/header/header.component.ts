import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { TranslateModuleService } from '../../services/translate-module.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title?: string;
  @Input() backButton!: string;
  @Input() menuButton!: boolean;
  @Input() isModal!: boolean;
  currentLanguage = '';
  utilServ = inject(UtilsService);
  translateModuleService = inject(TranslateModuleService);

  constructor() {}
  closeModal() {
    this.utilServ.dismisModal();
  }
  ngOnInit() {}
  changeLanguage(event: any) {
    this.currentLanguage = event.detail.value;
    this.utilServ.saveInLocalStorage('language', this.currentLanguage);
    this.translateModuleService.changeLanguage(this.currentLanguage);
  }
}
