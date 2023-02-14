import { Component, OnInit } from '@angular/core';
import { MysubscriptionService } from '../service/mysubscription.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../service/language.service';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-privacy-tab',
  templateUrl: './privacy-tab.component.html'
})
export class PrivacyTabComponent implements OnInit {

  unsub: any;
  userDetail: any;
  showPhoneOrEmail: boolean;
  userid: any;
  clicked = true;
  notificationList: any;
  profileEmail: any;
  profileNotification: any;
  postEmail: any;
  postNotification: any;
  referralNotification: any;

  langData: any = { common: '', createPostPage: '' };

  constructor(private mysubscription: MysubscriptionService, private toastr: ToastrService,
    private language: LanguageService, private generalService: GeneralService) { }

  ngOnInit() {
    console.log('privacy');
    this.unsub = this.mysubscription.userData.subscribe(res => {
      if (res) {
        console.log('res ', res);
        this.userDetail = res;
        console.log(this.userDetail);
        this.showPhoneOrEmail = this.userDetail.showPhoneNumberEmail;
      }
    });
    this.fetchLanguage();
    this.getAllNotificationStatus();
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

  getAllNotificationStatus() {
    this.generalService.getNotificationStatus()
    .subscribe( res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.notificationList = res['entity'];
        this.postEmail = this.notificationList.postEmail;
        this.postNotification = this.notificationList.postInApp;
        this.profileEmail = this.notificationList.profileEmail;
        this.profileNotification = this.notificationList.profileInApp;
        this.referralNotification = this.notificationList.referralInApp;
      }
    });
  }

  changeNotification(value: any, type: any) {
    console.log('value ', value, 'type ', type);
    if (type === 'referNotify') {
      this.referralNotification = value;
    }
    if (type === 'profileMail') {
      this.profileEmail = value;
    }
    if (type === 'profileNotify') {
      this.profileNotification = value;
    }
    if (type === 'postMail') {
      this.postEmail = value;
    }
    if (type === 'postNotify') {
      this.postNotification = value;
    }

    const data = {
      'isPostEmail': this.postEmail,
      'isPostInApp': this.postNotification,
      'isPostPushNotify': true,
      'isProfileEmail': this.profileEmail,
      'isProfileInApp': this.profileNotification,
      'isProfilePushNotify': true,
      'isReferralInApp': this.referralNotification,
      'isReferralPushNotify': true
    };

    console.log('data ', data);
    this.generalService.updateNotificationStatus(data)
    .subscribe(res => {
      console.log(res);
    });
  }

  changeStatus() {
    this.toastr.clear();
    console.log('change status');
    this.userid = localStorage.getItem('UserId');
    this.generalService.changePhoneEmailPrivacy(this.userid)
    .subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.toastr.success(res['msg']);
      }, 0);
    });
  }

}
