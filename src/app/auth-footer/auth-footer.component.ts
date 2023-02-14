import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../service/language.service';
import { RegisterService } from '../service/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-footer',
  templateUrl: './auth-footer.component.html'
})
export class AuthFooterComponent implements OnInit {

  d = new Date();
  year = this.d.getFullYear();
  languageData: any;
  languageSelected: any;

  langData: any = {common: '', loginFooterPage: ''};
  constructor(private language: LanguageService, private service: RegisterService,
    private router: Router) { }

  ngOnInit() {
    this.fetchLanguage();
    this.getLang();
  }

  changeLanguage(value: any) {
    console.log('language ', value);
    localStorage.setItem('languageSelected', value);
  }

  fetchLanguage() {
    this.language.getLanguageData(1)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.langData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getLang() {
    this.service.getAllLanguage().subscribe(res => {
      if (res) {
        if (res['entity'] !== null) {
          this.languageData = res['entity'];
        }
      }
    });
  }

  clickLogo() {
    console.log('logo');
    window.scrollTo(0, 0);    
  }

}
