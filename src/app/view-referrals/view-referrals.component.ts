import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { RefferalService } from '../service/refferal.service';
import * as moment from 'moment-timezone';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../service/post.service';
import { MysubscriptionService } from '../service/mysubscription.service';
import { LanguageService } from '../service/language.service';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-view-referrals',
  templateUrl: './view-referrals.component.html',
  styleUrls: ['./view-referrals.component.scss']
})
export class ViewReferralsComponent implements OnInit {
  currentDate = new Date();
  tabActive = 1;
  public loading = false;
  myFiles = [{ name: 'document1.xl', file: '.xls' }, { name: 'document1.xl', file: '.xls' }];
  currentPage = 1;
  receiverPage = 1;
  receiverPagesize = 10;
  pageSize = 10;
  sendReferralEntity: any = [];
  sendReferralCount = 0;
  sendReferralLocation: any = [];
  sendReferralFileData: any = [];
  receiveReferralCount = 0;
  tabone = true;
  receiveReferralEntity: any = [];
  receiveReferralLocation: any = [];
  receiveReferralFileData: any = [];
  cloudeURL = environment.cloudFrontURL;
  userPlanType: any;
  referalLimit: any;
  referalUsage: any;
  userId: string;
  errorMessage = 'You have done with your Referal, Please upgrade your plan';
  isNotification: any;

  langData: any = { common: '', viewReferralPage: '' };
  constructor(private router: Router, private referralService: RefferalService,
    private toastr: ToastrService, private postservices: PostService,
    private mysubscription: MysubscriptionService, private language: LanguageService,
    private generalService: GeneralService) { }

  ngOnInit() {
    this.generalService.tabActive.next('/view-referral');
    this.generalService.referralNotification.subscribe( res => {
      console.log(res);
      if (res) {
        this.isNotification = res;
        if (this.isNotification === 'true') {
          this.tabActive = 2;
          this.tabone = false;
        }
      }
    });
    localStorage.removeItem('myPostData');
    this.userId = localStorage.getItem('UserId');
    console.log(localStorage.getItem('myPostData'), '***');
    this.loading = true;
    this.getsendReferrals();
    this.getReceiveReferrals();
    this.getmySubscription();
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

  getmySubscription() {
    let params = new HttpParams();
    params = params.append('userId', this.userId.toString());
    this.mysubscription.getMySubscription(params).subscribe((res) => {
      if (res['status']['status'] === 200) {
        this.userPlanType = res['entity']['plantype'];
        localStorage.setItem('userPlanType', res['entity']['plantype']);
        localStorage.setItem('userPlan', JSON.stringify(res['entity']));
        localStorage.setItem('stripeId', res['entity']['stripecustomerid']);
      } else if (res['status']['status'] === 204) {
        localStorage.setItem('userPlanType', '');
        localStorage.setItem('userPlan', null);
      }
      this.referalLimit = res['entity']['referrallimit'];
      this.referalUsage = res['entity']['referralusage'];
    });
  }

  tabChange(input) {
    console.log(input);
    this.tabActive = input;
    if (this.tabActive === 1) {
      this.tabone = true;
      // this.router.navigate(['/view-referrals']);
    }
    if (this.tabActive === 2) {
      this.tabone = false;
      // this.router.navigate(['/received-referrals']);
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
          this.sendReferralEntity = res['entity'];
          console.log(this.sendReferralEntity);
          this.sendReferralCount = res['count'];
          localStorage.setItem('sendReferralCount', JSON.stringify(this.sendReferralCount));
          for (let i = 0; i < this.sendReferralEntity.length; i++) {
            if ((this.sendReferralEntity[i].profilecompanywebsite !== null || this.sendReferralEntity[i].profilecompanywebsite !== ''
             || this.sendReferralEntity[i].referralfiles.length > 0)) {
              this.sendReferralEntity[i].viewmore = true;
            }
            // this.sendReferralEntity[i].sendtype = 2;
            this.sendReferralLocation = this.sendReferralEntity[i].referrallocation;
            for (let j = 0; j < this.sendReferralLocation.length; j++) {
              this.sendReferralLocation[j].showreferralLocation = '';
              if (this.sendReferralLocation[j].cityid === null && this.sendReferralLocation[j].stateid === null
                && this.sendReferralLocation[j].countryid === null && this.sendReferralLocation[j].continentid !== null) {
                this.sendReferralLocation[j].showreferralLocation = (this.sendReferralLocation[j].continentid.continentname);
                console.log('1', j);
              }
              if (this.sendReferralLocation[j].cityid === null && this.sendReferralLocation[j].stateid === null
                && this.sendReferralLocation[j].countryid !== null && this.sendReferralLocation[j].continentid !== null) {
                this.sendReferralLocation[j].showreferralLocation = (this.sendReferralLocation[j].countryid.countryname);
                console.log('2', j);

              }
              if (this.sendReferralLocation[j].cityid === null && this.sendReferralLocation[j].stateid !== null
                && this.sendReferralLocation[j].countryid !== null && this.sendReferralLocation[j].continentid !== null) {
                console.log('3', j);
                this.sendReferralLocation[j].showreferralLocation = (this.sendReferralLocation[j].stateid.statename);
              }
              if (this.sendReferralLocation[j].cityid !== null && this.sendReferralLocation[j].stateid !== null
                && this.sendReferralLocation[j].countryid !== null && this.sendReferralLocation[j].continentid !== null) {
                console.log('4', j);
                this.sendReferralLocation[j].showreferralLocation = (this.sendReferralLocation[j].cityid.cityname);

              }
            }
            console.log(this.sendReferralLocation);
            this.sendReferralEntity[i].referrallocation = this.sendReferralLocation;
            console.log(this.sendReferralEntity);
            this.sendReferralFileData = this.sendReferralEntity[i].referralfiles;
            for (let index = 0; index < this.sendReferralFileData.length; index++) {
              if (this.sendReferralFileData[index].url) {
                const extension = this.sendReferralFileData[index].url.split('.');
                let fileextension;
                if (extension && extension.length > 0) {
                  fileextension = extension[1];
                }
                this.sendReferralFileData[index].fileext = fileextension;
                console.log(this.sendReferralFileData);
                this.sendReferralEntity[i].referralfiles = this.sendReferralFileData;
                console.log(this.sendReferralEntity);
              }
            }
          }
          console.log(this.sendReferralEntity);
          this.loading = false;
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }

  sentReferralChange(event) {
    console.log(event);
    this.currentPage = event;
    this.getsendReferrals();
  }

  recvreferralchange(event) {
    this.receiverPage = event;
    this.getReceiveReferrals();
  }

  viewmorepage2(recvrefer) {
    recvrefer['viewmore'] = !recvrefer['viewmore'];
  }

  viewpost(postid, userid) {
    console.log(postid);
    const userId = userid;
    this.postservices.viewPost(postid, userId).subscribe((responseview) => {
      console.log(responseview);
      if (responseview['status']['status'] === 200) {
        localStorage.setItem('myPostData', JSON.stringify(responseview['entity']));
        this.router.navigate(['/view-post', postid]);
      } else if (responseview['status']['status'] === 228 || responseview['status']['status'] === 227) {
        this.loading = false;
        localStorage.removeItem('myPostData');
        localStorage.setItem('ReferalPost', 'true');
        this.router.navigate(['/view-post', postid]);
      }
    }, err => {
      this.loading = false;
      localStorage.removeItem('myPostData');
      // this.toastr.error('Sorry, the user has temporarily removed this post');
    });
  }

  resend(data) {
    this.toastr.clear();
    console.log(data);
    if (this.referalLimit === this.referalUsage) {
      this.toastr.error(this.errorMessage);
    } else {
      if (data.sendtype === '2') {
        console.log(data);
        const body = {
          senderid: localStorage.getItem('UserId'),
          referenceno: data.referralreferenceno
        };
        // console.log(body, 'IJKjkl');
        this.referralService.resendReferral(body).subscribe((res) => {
          if (res['status']['status'] === 200) {
            this.toastr.success(res['status']['msg']);
            this.getsendReferrals();
          }
        });
      } else {
        console.log('No Referral');
      }
    }
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
      this.toastr.error('File does not exist');
      // window.open(linka + url);
    });
  }

  getReceiveReferrals() {
    let params = new HttpParams();
    params = params.append('pageNumber', this.receiverPage.toString());
    params = params.append('pageSize', this.receiverPagesize.toString());
    this.referralService.getreceiverreferral(params)
      .subscribe(res => {
        console.log(res);
        if (res && res['status'] && res['status']['status'] === 200) {
          this.receiveReferralEntity = res['entity'];
          this.receiveReferralCount = res['count'];
          console.log(this.receiveReferralEntity);
          for (let i = 0; i < this.receiveReferralEntity.length; i++) {
            if (this.receiveReferralEntity[i].profilecompanywebsite !== null || this.receiveReferralEntity[i].profilecompanywebsite !== ''
            || this.receiveReferralEntity[i].referralfiles.length > 0) {
              this.receiveReferralEntity[i].viewmore = true;
            }
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

  convertutctolocal(value): string {
    const time = value.toString().split('T');
    return this.setLocaldatetime(time[0], time[1]);
  }

  setLocaldatetimewithsecond(date, time) {
    let now_utc1 = '0';
    let local;
    if (date && time) {
      const now1 = new Date(date + ' ' + time);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-'
      + this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes(+':00'));
    }
    return now_utc1;
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

  convert24to12(value): string {
    let timevalue = '';
    let time = value.toString().split(' ');
    if (time && time[1]) {
      time = time[1].toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      timevalue = time.join(''); // return adjusted time or original string
    }
    return timevalue;
  }

  chkLength(data) {
    if (data.toString().length === 1) {
      return '0' + data.toString();
    } else {
      return data;
    }
  }

  viewmorepage(sentrefer) {
    sentrefer['viewmore'] = !sentrefer['viewmore'];
  }

}
