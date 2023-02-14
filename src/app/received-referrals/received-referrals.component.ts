import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { RefferalService } from '../service/refferal.service';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-received-referrals',
  templateUrl: './received-referrals.component.html'
})
export class ReceivedReferralsComponent implements OnInit {
  tabActive = 2;
  cloudeURL = environment.cloudFrontURL;
  public loading = false;
  currentDate = new Date();
  myFiles = [{ name: 'document1.xl', file: '.xls' }, { name: 'document1.xl', file: '.xls' }];
  currentPage = 1;
  pageSize = 10;
  receiveReferralEntity: any = [];
  receiveReferralLocation: any = [];
  receiveReferralFileData: any = [];
  receiveReferralCount = 0;
  sendReferralCount = 0;

  constructor(private router: Router, private referralService: RefferalService) { }

  ngOnInit() {
    this.sendReferralCount = JSON.parse(localStorage.getItem('sendReferralCount'));
    this.receiveReferralCount = JSON.parse(localStorage.getItem('receiveReferralCount'));
    this.getReceiveReferrals();
    this.getsendReferrals();
  }

  tabChange(input) {
    console.log(input);
    this.tabActive = input;
    if (this.tabActive === 1) {
      this.router.navigate(['/view-referral']);
    }
    if (this.tabActive === 2) {
      this.router.navigate(['/received-referrals']);
    }
  }

  getsendReferrals() {
    let params = new HttpParams();
    params = params.append('pageNumber', this.currentPage.toString());
    params = params.append('pageSize', this.pageSize.toString());
    this.referralService.getsendreferral(params)
      .subscribe(res => {
        console.log(res);
        if (res && res['status'] && res['status']['status'] === 200) {
          this.sendReferralCount = res['count'];
        }
      });
  }

  getReceiveReferrals() {
    let params = new HttpParams();
    params = params.append('pageNumber', this.currentPage.toString());
    params = params.append('pageSize', this.pageSize.toString());
    this.referralService.getreceiverreferral(params)
      .subscribe(res => {
        console.log(res);
        if (res && res['status'] && res['status']['status'] === 200) {
          this.receiveReferralEntity = res['entity'];
          this.receiveReferralCount = res['count'];
          console.log(this.receiveReferralEntity);
          for (let i = 0; i < this.receiveReferralEntity.length; i++) {
            this.receiveReferralEntity[i].viewmore = true;
            this.receiveReferralFileData = this.receiveReferralEntity[i].referralfiles;
            for (let index = 0; index < this.receiveReferralFileData.length; index++) {
              if (this.receiveReferralFileData[index].url) {
                const extension = this.receiveReferralFileData[index].url.split('.');
                let fileextension;
                if (extension && extension.length > 0) {
                  fileextension = extension[1];
                }
                this.receiveReferralFileData[index].fileext = fileextension;
                console.log(this.receiveReferralFileData);
                this.receiveReferralEntity[i].referralfiles = this.receiveReferralFileData;
                console.log(this.receiveReferralEntity);
              }
            }
          }
        }
      });
  }

  recvreferralchange(event) {
    this.currentPage = event;
    this.getReceiveReferrals();
  }

  convertutctolocal(value): string {
    const time = value.toString().split('T');
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
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-' +
      this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes());
    }
    return now_utc1;
  }

  chkLength(data) {
    if (data.toString().length === 1) {
      return '0' + data.toString();
    } else {
      return data;
    }
  }

  viewmorepage(recvrefer) {
    recvrefer['viewmore'] = !recvrefer['viewmore'];
  }

  viewpost(postid) {
    console.log(postid);
    this.router.navigate(['/view-post', postid]);
  }

  viewprofile(userid) {
    console.log(userid);
    this.router.navigate(['/view-profile', userid]);
  }

  download(linka, url) {
    const headers = new Headers();
    const requestOptions: any = {
      method: 'GET',
      headers: { headers }, mode: 'cors', cache: 'default'
    };
    fetch(linka + url, requestOptions).then((response) => {
      return response.blob();
    }).then((myBlob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(myBlob);
      link.setAttribute('visibility', 'hidden');
      link.download = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch((error) => {
      window.open(linka + url);
    });
  }
}
