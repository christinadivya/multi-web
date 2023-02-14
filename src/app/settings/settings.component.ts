import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MysubscriptionService } from '../service/mysubscription.service';
import { Router } from '@angular/router';
import { RegisterService } from '../service/register.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  planContent = false;
  content = true;
  Id = '';
  activeTab = false;
  generalTab = false;
  privacyTab = false;
  userData: any;

  constructor(private mysubscribe: MysubscriptionService, private router: Router,
    private regService: RegisterService) {
    const geturl = this.router.url;
    const params = geturl.split('settings/');
    this.Id = params[1];
    console.log('$$$', this.Id);
    if (this.Id === 'billing') {
      this.activeTab = true;
      this.generalTab = false;
      this.privacyTab = false;
    }
    if (this.Id === 'true') {
      this.activeTab = false;
      this.generalTab = true;
      this.privacyTab = false;
    }
    if (this.Id === 'privacy') {
      this.activeTab = false;
      this.generalTab = false;
      this.privacyTab = true;
    }
   }

  ngOnInit() {
    this.getUserDetail();
    const geturl = this.router.url;
    const params = geturl.split('settings/');
    this.Id = params[1];
    console.log('$$$', this.Id);
    if (this.Id === 'billing') {
      this.activeTab = true;
      this.generalTab = false;
      this.privacyTab = false;
    }
    if (this.Id === 'true') {
      this.activeTab = false;
      this.generalTab = true;
      this.privacyTab = false;
    }
    if (this.Id === 'privacy') {
      this.activeTab = false;
      this.generalTab = false;
      this.privacyTab = true;
    }
    this.mysubscribe.profileClicked.subscribe((res) => {
      if (res === 'ProfileClicked') {
        this.generalTab = true;
        this.activeTab = false;
        this.privacyTab = false;
      }
    });
    this.mysubscribe.profileClicked.subscribe((res) => {
      if (res === 'SettingsClicked') {
        this.activeTab = true;
        this.generalTab = false;
        this.privacyTab = false;
      }
    });
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'PrivacyClicked') {
        this.activeTab = false;
        this.generalTab = false;
        this.privacyTab = true;
      }
    });
  }

  getUserDetail() {
    const userid = localStorage.getItem('UserId');
    this.regService.userDetails(userid).subscribe(res => {
      console.log('response ', res);
      this.userData = res['entity'];
      this.mysubscribe.userData.next(this.userData);
    });
  }

  billTabClicked () {
    this.mysubscribe.billingEmit.emit('Billing');
    this.mysubscribe.tabEmit.emit('true');
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'ProfileClicked') {
        this.generalTab = true;
      }
    });
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'SettingsClicked') {
        this.activeTab = true;
      }
    });
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'PrivacyClicked') {
        this.privacyTab = true;
      }
    });
  }

  generalTabClicked() {
    this.mysubscribe.billingEmit.emit('Billing');
    this.mysubscribe.tabEmit.emit('true');
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'SettingsClicked') {
        this.activeTab = true;
      }
    });
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'ProfileClicked') {
        this.generalTab = true;
      }
    });
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'PrivacyClicked') {
        this.privacyTab = true;
      }
    });
  }

  privacyTabClicked() {
    this.mysubscribe.billingEmit.emit('Billing');
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'PrivacyClicked') {
        this.privacyTab = true;
      }
    });
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'SettingsClicked') {
        this.activeTab = true;
      }
    });
    this.mysubscribe.settingsClicked.subscribe((res) => {
      if (res === 'ProfileClicked') {
        this.generalTab = true;
      }
    });
  }
}
