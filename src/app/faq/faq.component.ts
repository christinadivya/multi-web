import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../service/language.service';
import { GeneralService } from '../service/general.service';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {

  faqList = [
    {
      id: 1,
      heading: 'General'
    },
    {
      id: 2,
      heading: 'Account / Profile'
    },
    {
      id: 3,
      heading: 'Search'
    },
    {
      id: 4,
      heading: 'Subscription'
    },
    {
      id: 5,
      heading: 'Sharing / Social Media'
    },
    {
      id: 6,
      heading: 'Feedback'
    }
  ];

  faqQAList: any = [];
  header: any;
  headerid: any = 1;
  plantype: any;
  intervaltype: any;

  langData: any = { common: '', faqPage: '' };

  constructor(@Inject(DOCUMENT) private document: Document,
  private router: Router, private generalService: GeneralService,
    private language: LanguageService) { }

  ngOnInit() {
    this.document.body.classList.add('bg-white');
    window.scrollTo(0, 0);
    this.fetchLanguage();
    this.getAllFAQs(1);
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

  getAllFAQs(id: any) {
    this.headerid = id;
    this.generalService.getAllFAQ(this.headerid)
    .subscribe( res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.faqQAList = res['entity'];
        this.header = this.faqQAList[0].header;
      }
    });
  }

  changeHeader(value: any) {
    console.log('faq', value);
    this.getAllFAQs(value);
  }
}
