import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormulaService {
  httpClient = inject(HttpClient);
  apiURL: string = 'https://f1-live-motorsport-data.p.rapidapi.com/races/2023';
  httpOptions = {
    headers: environment.headers,
    method: 'GET',
  };

  constructor() {}
  getSeazon() {
    return this.httpClient.get(this.apiURL, this.httpOptions);
  }
  getRequest() {
    let url =
      'https://opentdb.com/api.php?amount=1&difficulty=hard&type=multiple';
    const options = {
      method: 'POST',

      headers: {
        'X-RapidAPI-Key': '3ea80dcb22msh7ca91af17d915bap1842b0jsn13b163c71abe',
        'X-RapidAPI-Host': 'AccuWeatherstefan-skliarovV1.p.rapidapi.com',
      },
    };
    return this.httpClient.get(url);
  }
}
