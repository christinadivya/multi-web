import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { LanguageService } from '../service/language.service';
import { GeneralService } from '../service/general.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {

  currentPage = 1;
  pageSize = 10;
  userId: any;
  notificationList = [];
  totalCount = 0;
  currentDate = new Date();
  public loading = false;
  notificationFor: any;
  totalNotificationCount = 0;
  diffInDays: any;
  newDate: any;
  viewType: any;

  langData: any = { common: '', notificationPage: '' };

  constructor(private router: Router, private language: LanguageService,
    private generalService: GeneralService) { }

  ngOnInit() {
    this.generalService.tabActive.next('/notifications');
    localStorage.removeItem('notifyFor');
    // this.generalService.overAllNotificationCount.next(0);
    this.fetchLanguage();
    this.changeUnSeenStatus();
    this.getAllNotification();
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

  changeUnSeenStatus() {
    this.userId = localStorage.getItem('UserId');
    this.generalService.overAllNotificationCount.next(this.totalNotificationCount);
    this.generalService.changeNotificationStatusToSeen(this.userId)
    .subscribe( res => {
      console.log(res);
      if (res) {
        this.generalService.overAllNotificationCount.next(0);
      }
    });
  }

  getAllNotification() {
    window.scrollTo(0, 0);
    this.loading = true;
    let params = new HttpParams();
    this.userId = localStorage.getItem('UserId');
    params = params.append('id', this.userId.toString());
    params = params.append('pagenumber', this.currentPage.toString());
    params = params.append('pagerecord', this.pageSize.toString());
    this.generalService.getAllNotification(params.toString()).subscribe( res => {
      this.loading = false;
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200 && res['status']['msg'] === 'Success') {
        this.notificationList = res['entity'];
        this.totalCount = res['count'];
      } else {
        this.notificationList = [];
        this.totalCount = 0;
      }
    });
  }

  notificationChange(pageno: any) {
    console.log(pageno);
    this.currentPage = pageno;
    this.getAllNotification();
  }

  changeToReadStatus(id: any) {
    console.log('notificationid ', id);
    let params = new HttpParams();
    params = params.append('notificationid', id);
    this.generalService.changeUnreadToReadStatus(params.toString()).subscribe( res => {
      console.log(res);
      if (res && res['status']) {
        this.getAllNotification();
      }
    });
  }

  calculateDiff(notifyDate: any) {
    const d2: Date = new Date();
    const d1 = Date.parse(notifyDate); // time in milliseconds
    const timeDiff = d2.getTime() - d1;
    const diff = timeDiff / (1000 * 3600 * 24);
    return Math.round(diff);
  }

  viewProfilePostList(type: any, notification: any) {
    console.log(type, notification.createdOn, this.currentDate);
    if (notification.createdOn) {
      const time = notification.createdOn.toString().split(' ');
      console.log(time[0], time[1]);
      this.generalService.notificationDate.next(time[0]);
    }
    this.diffInDays = this.calculateDiff(notification.createdOn);
    console.log(this.diffInDays);
    if (this.diffInDays === 1) {
      this.viewType = 'Today';
    }
    if (this.diffInDays > 1 && this.diffInDays < 8) {
      this.viewType = 'Week';
    }
    if (this.diffInDays > 7) {
      this.viewType = 'Month';
    }
    console.log(this.viewType);
    this.generalService.viewType.next(this.viewType);
    this.notificationFor = type;
    this.generalService.notificationType.next(this.notificationFor);
    this.changeToReadStatus(notification.id);
    this.router.navigate(['/viewed-profile']);
  }

  viewReferral(notification: any) {
    this.generalService.referralNotification.next('true');
    this.changeToReadStatus(notification.id);
    this.router.navigate(['/view-referral']);
  }

  convertutctolocal(value): string {
    const time = value.toString().split(' ');
    return this.setLocaldatetime(time[0], time[1]);
  }

  setLocaldatetime(date, time2): string {
    const timeobj = time2.split(':');
    const time1 = timeobj[0] + ':' + timeobj[1] + ':00';
    let now_utc1 = '0';
    let local;
    if (date && time1) {
      const now1 = new Date(date + ' ' + time1);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-' + this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes());
    }
    return now_utc1;
  }

  chkLength(data: any) {
    if (data.toString().length === 1) {
      return '0' + data.toString();
    } else {
      return data;
    }
  }

  viewmessage(notification: any) {
    localStorage.setItem('profileid', notification.userid);
    this.changeToReadStatus(notification.id);
    this.router.navigate(['/messages']);
  }

}
