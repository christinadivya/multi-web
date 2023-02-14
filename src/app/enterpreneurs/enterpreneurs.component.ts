import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { GeneralService } from '../service/general.service';
import { LanguageService } from '../service/language.service';

@Component({
  selector: 'app-enterpreneurs',
  templateUrl: './enterpreneurs.component.html'
})
export class EnterpreneursComponent implements OnInit {

  subscriptionList: any = [];
  plantype: any;
  intervaltype: any;

  langData: any = { common: '', entrepreneurPage: '' };

  constructor(private router: Router, private generalService: GeneralService,
    private language: LanguageService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.document.body.classList.add('bg-white');
    localStorage.removeItem('plantype');
    localStorage.removeItem('intervaltype');
    window.scrollTo(0, 0);
    this.fetchLanguage();
    this.getAllPlans();
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

  getAllPlans() {
    const data = {
      'pagenumber': 0,
      'pagerecord': 0,
      'sorttype': 'asc',
      'type': 'month',
      'published': 'all'
    };
    this.generalService.getAllPlansForPricing(data)
    .subscribe(res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.subscriptionList = res['entity']['managePlanList'];
      } else {
        this.subscriptionList = [];
      }
    });
  }

  signUp(planname: any, interval: any) {
    console.log(localStorage.getItem('plantype'), localStorage.getItem('intervaltype'));
    console.log('planname ', planname, 'interval ', interval);
    if (planname === 'Silver') {
      this.plantype = 1;
      this.intervaltype = '';
    }
    if (planname === 'Gold') {
      this.plantype = 2;
      this.intervaltype = interval;
    }
    if (planname === 'Limited Platinum') {
      this.plantype = 3;
      this.intervaltype = '';
    }
    if (planname === 'Platinum') {
      this.plantype = 4;
      this.intervaltype = interval;
    }
    localStorage.setItem('plantype', this.plantype);
    localStorage.setItem('intervaltype', this.intervaltype);
    console.log(localStorage.getItem('plantype'), localStorage.getItem('intervaltype'));
    this.router.navigate(['/home']);
    window.scrollTo(0, 0);
  }

}
