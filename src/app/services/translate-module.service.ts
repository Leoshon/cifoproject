import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class TranslateModuleService {
  translateModuleService=inject(TranslateService);

  constructor() { }
  public changeLanguage(language: string) {
    this.translateModuleService.use(language);
  }
  public getLanguage(): string{
    return this.translateModuleService.currentLang;
  }
  public get(key: string): string {
    let value = '';
    this.translateModuleService.get(key).subscribe((text: string) => {
      value = text;
    });
    return value;
  }
}
