import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private http: HttpClient) { }


  // ngOnInit() {
  //   this.getLanguageData();
  // }

  getLanguageData(lang) {
    let setlang = 'assets/json/english.json';
    if (lang === 1) {
      setlang = 'assets/json/english.json';
    } else if (lang === 2) {
      setlang = 'assets/json/arabic.json';
    }

    return this.http.get(setlang);
  }

}
