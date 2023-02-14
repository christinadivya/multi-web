import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../service/general.service';
import { LanguageService } from '../service/language.service';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RefferalService } from '../service/refferal.service';

@Component({
  selector: 'app-viewed-profile',
  templateUrl: './viewed-profile.component.html'
})
export class ViewedProfileComponent implements OnInit {

  notificationType: any = 'profile';
  notificationDate: any;
  getSubscribe: any;
  getTypeSubscribe: any;
  getDateSubscribe: any;
  public loading = false;
  currentPage = 1;
  pageSize = 9;
  viewdBy = 'Week';
  type = 2;
  viewList: any = [];
  viewedCount = 0;
  cloudeURL = environment.cloudFrontURL;
  profileOrPostListHeader: any;

  langData: any = { common: '', notificationPage: '' };

  constructor(private router: Router, private generalService: GeneralService,
    private language: LanguageService, private referralService: RefferalService) { }

  ngOnInit() {
    this.getDateSubscribe = this.generalService.notificationDate.subscribe( res => {
      if (res) {
        this.notificationDate = res;
      }
    });
    this.getSubscribe = this.generalService.notificationType.subscribe( res => {
      console.log(res);
      if (res) {
        this.notificationType = res;
      } else {
        this.notificationType = '';
      }
    });
    this.getTypeSubscribe = this.generalService.viewType.subscribe( res => {
      console.log(res);
      if (res) {
        this.viewdBy = res;
        this.changeViewedBy(this.viewdBy);
      } else {
        this.viewdBy = 'Week';
      }
    });
    if (this.notificationType !== '') {
      localStorage.setItem('notifyFor', this.notificationType);
    }
    this.fetchLanguage();
    this.getProfileOrPostList(localStorage.getItem('notifyFor'));
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

  changeViewedBy(view: any) {
    this.currentPage = 1;
    this.viewdBy = view;
    if (this.viewdBy === 'Today') {
      this.type = 1;
    } if (this.viewdBy === 'Week') {
      this.type = 2;
    } if (this.viewdBy === 'Month') {
      this.type = 3;
    }
    this.getProfileOrPostList(localStorage.getItem('notifyFor'));
  }

  getProfileOrPostList(viewtype: any) {
    if (viewtype === 'profile') {
      this.profileOrPostListHeader = 'No. of People viewed your profile';
      this.getProfileList();
    }
    if (viewtype === 'post') {
      this.profileOrPostListHeader = 'No. of People viewed your post';
      this.getPostList();
    }
  }

  getProfileList() {
    console.log('profile ', this.viewdBy);
    window.scrollTo(0, 0);
    this.loading = true;
    let params = new HttpParams();
    params = params.append('type', this.type.toString());
    params = params.append('pagenumber', this.currentPage.toString());
    params = params.append('pagerecord', this.pageSize.toString());
    params = params.append('date', this.notificationDate);
    console.log('profile data ', params.toString());
    this.generalService.getProfileView(params.toString()).subscribe( res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.loading = false;
        this.viewList = res['entity'];
        this.viewedCount = res['count'];
        for (let i = 0; i < this.viewList.length; i++) {
          if (this.viewList[i].addressline1 !== null) {
            this.viewList[i].location = this.viewList[i].addressline1;
          }
          if (this.viewList[i].cityname !== null && this.viewList[i].addressline1 !== null) {
            this.viewList[i].location += ',' + this.viewList[i].cityname;
          }
          if (this.viewList[i].countryname !== null) {
            this.viewList[i].location += ',' + this.viewList[i].countryname;
          }
        }
        console.log(this.viewList);
      } else {
        this.loading = false;
        this.viewList = [];
        this.viewedCount = 0;
      }
    });
  }

  getPostList() {
    console.log('post ', this.viewdBy);
    window.scrollTo(0, 0);
    this.loading = true;
    let params = new HttpParams();
    params = params.append('type', this.type.toString());
    params = params.append('pagenumber', this.currentPage.toString());
    params = params.append('pagerecord', this.pageSize.toString());
    params = params.append('date', this.notificationDate);
    console.log('post data ', params.toString());

    this.generalService.getPostView(params.toString()).subscribe( res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.loading = false;
        this.viewList = res['entity'];
        this.viewedCount = res['count'];
        for (let i = 0; i < this.viewList.length; i++) {
          if (this.viewList[i].addressline1 !== null) {
            this.viewList[i].location = this.viewList[i].addressline1;
          }
          if (this.viewList[i].cityname !== null && this.viewList[i].addressline1 !== null) {
            this.viewList[i].location += ',' + this.viewList[i].cityname;
          }
          if (this.viewList[i].countryname !== null) {
            this.viewList[i].location += ',' + this.viewList[i].countryname;
          }
        }
      } else {
        this.loading = false;
        this.viewList = [];
        this.viewedCount = 0;
      }
    });
  }

  viewListChange(pageno) {
    console.log(localStorage.getItem('notifyFor'));
    this.currentPage = pageno;
    if (localStorage.getItem('notifyFor') === 'profile') {
      this.getProfileList();
    }
    if (localStorage.getItem('notifyFor') === 'post') {
      this.getPostList();
    }
  }

  viewProfile(view: any) {
    console.log(view);
    this.router.navigate(['/view-profile', view.userid]);
  }
}
