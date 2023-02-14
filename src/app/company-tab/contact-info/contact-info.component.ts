import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/service/post.service';
import { LanguageService } from 'src/app/service/language.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html'
})
export class ContactInfoComponent implements OnInit {
  postdata: any;
  langData: any = {common: '', viewPostPage: ''};
  constructor(private Postservices: PostService,
              private language: LanguageService) { }

  ngOnInit() {
    // behavioural Subject Fetching Value
    this.Postservices.cast.subscribe(res => this.postdata = res);
    this.fetchLanguage();
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

}
