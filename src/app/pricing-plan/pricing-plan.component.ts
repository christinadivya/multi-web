import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GeneralService } from '../service/general.service';
import { LanguageService } from '../service/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.scss']
})
export class PricingPlanComponent implements OnInit {

  subscriptionList: any = [];
  showMonth = false;
  plantype: any;
  intervaltype: any;

  langData: any = { common: '', pricingPage: '' };

  constructor(@Inject(DOCUMENT) private document: Document,
  private generalService: GeneralService, private language: LanguageService,
  private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('plantype');
    localStorage.removeItem('intervaltype');
    window.scrollTo(0, 0);
    this.document.body.classList.add('bg-white');
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

  changeStatus(value: any) {
    console.log(value);
    // this.showMonth = value;
    let data = {};
    if (value === true) {
      data = {
        'pagenumber': 0,
        'pagerecord': 0,
        'sorttype': 'asc',
        'type': 'year',
        'published': 'all'
      };
    } else {
      data = {
        'pagenumber': 0,
        'pagerecord': 0,
        'sorttype': 'asc',
        'type': 'month',
        'published': 'all'
      };
    }
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
    this.router.navigate(['/home']);
    window.scrollTo(0, 0);
  }

}
