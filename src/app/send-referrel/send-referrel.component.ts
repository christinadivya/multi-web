import { Component, OnInit } from '@angular/core';
import { RefferalService } from '../service/refferal.service';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { MysubscriptionService } from '../service/mysubscription.service';
import { LanguageService } from '../service/language.service';
import { TruncateModule } from 'ng2-truncate';

@Component({
  selector: 'app-send-referrel',
  templateUrl: './send-referrel.component.html'
})
export class SendReferrelComponent implements OnInit {
  PlanBased = false;
  radioButton = false;
  search = '';
  searchMessage = '';
  sendRefButton = true;
  currentPage = 1;
  pageSize = 10;
  total = 0;
  localpage = null;
  isSelectAllButton = false;
  buttonShow = 'Select All';
  selectedrefferals = [];
  public loading = false;
  applyBlur = false;
  sendreferralarray = [{
    ischeck: false,
    name: 'User Name',
    senttype: 0,
    companyname: 'Company Name',
    location: 'Location',
    companywebsite: 'Website',
    img: './assets/images/receivedimg2.png',
    userid: null,
    acctypeshortname: 'Company Type'
  }];
  cloudeURL = environment.cloudFrontURL;
  industryid = [];
  locationid = [];
  sendpostObj;
  selecAllArray = [];
  errorMessage = 'You have only one more referral left for this month';
  userId: string;
  userPlanType: any;
  referalLimit: any;
  referalUsage: any;
  tooltipStatus = '';
  hideSelectButton = false;
  hideSendReferralButton = false;

  langData: any = { common: '', sendReferralPage: '', searchPage: '', viewPostPage: '' };

  constructor(private router: Router, private refferalService: RefferalService,
    private toastr: ToastrService, private mysubscription: MysubscriptionService,
    private language: LanguageService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('UserId');
    this.loading = true;
    this.sendpostObj = localStorage.getItem('sendreferraldata');
    this.sendpostObj = JSON.parse(this.sendpostObj);
    this.getmySubscription();
    console.log(this.sendpostObj, '%%%');
    this.getIds();
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
        this.referalLimit = res['entity']['referrallimit'];
        this.referalUsage = res['entity']['referralusage'];
      }
      if (this.userPlanType === 'Limited Platinum' || this.userPlanType === 'Silver') {
        this.PlanBased = true;
        this.tooltipStatus = 'Please upgrade your plan to enable this feature';
      }
    });
  }

  async getIds() {
    await this.sendpostObj.referralLocation.map((ele) => {
      console.log(ele['cityid']['cityid'], '^^^8878');
      if (ele['cityid'] !== undefined || ele['stateid'] !== undefined ||
        ele['countryid'] !== undefined || ele['continentid'] !== undefined) {
        if (ele['cityid']['cityid'] === 0 && ele['stateid']['stateid'] === 0 &&
          ele['countryid']['countryid'] === 0 && ele['continentid']['continentid'] !== 0) {
          this.locationid.push(ele['continentid']['continentid']);
        }
        // tslint:disable-next-line:max-line-length
        if (ele['cityid']['cityid'] === 0 && ele['stateid']['stateid'] === 0 &&
          ele['countryid']['countryid'] !== 0 && ele['continentid']['continentid'] !== 0) {
          this.locationid.push(ele['countryid']['countryid']);
        }
        // tslint:disable-next-line:max-line-length
        if (ele['cityid']['cityid'] === 0 && ele['stateid']['stateid'] !== 0 &&
          ele['countryid']['countryid'] !== 0 && ele['continentid']['continentid'] !== 0) {
          this.locationid.push(ele['stateid']['stateid']);
        }
        // tslint:disable-next-line:max-line-length
        if (ele['cityid']['cityid'] !== 0 && ele['stateid']['stateid'] !== 0 &&
          ele['countryid']['countryid'] !== 0 && ele['continentid']['continentid'] !== 0) {
          this.locationid.push(ele['cityid']['cityid']);
        }
      }
    });
    // let unique = this.locationid.filter(function (elem, index, self) {
    //   return index === self.indexOf(elem);
    // });
    // this.locationid = unique;

    await this.sendpostObj.referralIndustry.map((ind) => {
      this.industryid.push(ind['industryid']);
    });

    console.log(this.sendpostObj.referralLocation, this.locationid, this.industryid);
    this.getprofilelist();
  }

  async getprofilelist() {
    this.loading = true;
    this.pageSize = 10;
    let data;
    if (this.sendpostObj['referralType'] === 'post') {
      data = {
        postid: this.sendpostObj['postId'],
        profileid: '',
        pageNumber: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
        search: this.search.toString(),
        industryid: this.industryid,
        locationid: this.locationid
      };
    } else {
      data = {
        postid: '',
        profileid: this.sendpostObj['profileId'],
        pageNumber: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
        search: this.search.toString(),
        industryid: this.industryid,
        locationid: this.locationid
      };
    }
    this.refferalService.getreferrerslist(data).subscribe(async (res) => {
      console.log(res);
      this.sendreferralarray = [];
      if (res && res['status']['status'] === 200) {
        if (res['entity'].length > 0) {
          await res['entity'].map(async (ele) => {
            const cityname = (ele.cityname !== null) ? (ele.cityname + ',') : '';
            const statename = (ele.statename !== null) ? (ele.statename + ',') : '';
            const countryname = (ele.countryname !== null) ? ele.countryname : '';
            let location = cityname + statename + countryname;
            location = Array.from(new Set(location.split(','))).toString();
            this.sendreferralarray.push(
              {
                userid: ele.userid,
                ischeck: (ele.senttype === '1') ? true : false,
                name: ele.firstname + ' ' + ele.lastname,
                senttype: ele.senttype,
                companyname: ele.companyname,
                acctypeshortname: ele.acctypeshortname,
                location: location,
                companywebsite: ele.companywebsite,
                img: (ele.companylogo === null) ? './assets/images/mobile-logo.png' :
                  this.cloudeURL + ele.companylogo
              });
            this.total = res['count'];
          });
          if ((localStorage.getItem('userPlanType') === 'Silver' ||
          localStorage.getItem('userPlanType') === 'Limited Platinum') && this.currentPage === 1) {
            await this.sendreferralarray.forEach((element, index) => {
              if (this.sendreferralarray[index]['senttype'] === 0
                || this.sendreferralarray[index]['senttype'] === 2) {
                this.selectedrefferals.map((ele) => {
                  if (element['userid'] === ele['userid']) {
                    if (ele['ischeck']) {
                      this.sendreferralarray[index]['ischeck'] = true;
                    }
                  }
                });
              }
            });
            await this.removeDuplicates();
          } else if (localStorage.getItem('userPlanType') !== 'Limited Platinum' && localStorage.getItem('userPlanType') !== 'Silver') {
            if (this.selecAllArray.length > 0) {
             await this.sendreferralarray.forEach((element, index) => {
                // console.log(this.sendreferralarray[index], '&&&&', index);
                if (this.sendreferralarray[index]['senttype'] === 0
                  || this.sendreferralarray[index]['senttype'] === 2) {
                  // console.log(this.sendreferralarray[index], '!!!!!!!!!!!!!!!!!!!!!!!!!!!', index);
                  this.selecAllArray.map((ele) => {
                    console.log(this.sendreferralarray[index], '#################', index);
                    if (element['userid'] === ele['userid']) {
                      if (ele['ischeck']) {
                        this.sendreferralarray[index]['ischeck'] = true;
                      }
                    }
                  });
                }
              });
              await this.removeDuplicates();
            }
          }
          this.loading = false;
          this.removeDuplicates();

        } else {
          this.total = 0;
          this.sendreferralarray = [];
          this.loading = false;
        }
      } else {
        this.total = 0;
        this.sendreferralarray = [];
        this.loading = false;

      }
    });
  }

  onSearchChange(searchValue: string) {
    console.log(searchValue, 'Search Value');
    this.search = searchValue.trim();
    this.currentPage = 1;
    console.log(this.currentPage);
    this.getprofilelist();
  }

  postChange(pageNo) {
    console.log('pageNo ', pageNo);
    window.scrollTo(0, 0);
    if (pageNo > 1 && (localStorage.getItem('userPlanType') === 'Silver' || localStorage.getItem('userPlanType') === 'Limited Platinum')) {
      console.log('if ', pageNo);
      this.applyBlur = true;
      this.hideSelectButton = true;
      this.hideSendReferralButton = true;
    } else {
      console.log('else ', pageNo);
      this.applyBlur = false;
      this.hideSelectButton = false;
      this.hideSendReferralButton = false;
    }
    this.loading = true;
    this.localpage = pageNo;
    this.currentPage = pageNo;
    this.pageSize = 10;
    this.getprofilelist();
  }

  goToLink(url: string) {
    console.log(url);
    if (url === '') {
      this.toastr.error('No website available');
    } else {
      const mySite = 'http://' + url;
      console.log(mySite);
      window.location.href = mySite;
    }
  }

  buttonClicked() {
    console.log(this.isSelectAllButton);
    if ((localStorage.getItem('userPlanType') === 'Silver' ||
    localStorage.getItem('userPlanType') === 'Limited Platinum') && this.currentPage > 1) {
      console.log('Nothing to select');
    } else {
      this.isSelectAllButton = !this.isSelectAllButton;
      this.buttonShow = (this.isSelectAllButton === false) ? 'Select All' : 'Deselect All';
      this.selectAll();
    }

  }
  async selectAll() {
    let data;
    console.log(this.isSelectAllButton);
    if (this.isSelectAllButton) {
      this.selectedrefferals = [];
      this.currentPage = 0;
      this.pageSize = 0;
      if (this.sendpostObj['referralType'] === 'post') {
        data = {
          postid: this.sendpostObj['postId'],
          profileid: '',
          pageNumber: this.currentPage.toString(),
          pageSize: this.pageSize.toString(),
          search: this.search.toString(),
          industryid: this.industryid,
          locationid: this.locationid
        };
      } else {
        data = {
          postid: '',
          profileid: this.sendpostObj['profileId'],
          pageNumber: this.currentPage.toString(),
          pageSize: this.pageSize.toString(),
          search: this.search.toString(),
          industryid: this.industryid,
          locationid: this.locationid
        };
      }

      await this.refferalService.getreferrerslist(data).subscribe(async (res) => {
        if (res && res['status']['status'] === 200) {
          console.log(res);
          if (res['entity'].length > 0) {
            await res['entity'].map(async (ele) => {
              const cityname = (ele.cityname !== null) ? (ele.cityname + ',') : '';
              const statename = (ele.statename !== null) ? (ele.statename + ',') : '';
              const countryname = (ele.countryname !== null) ? ele.countryname : '';
              if (this.currentPage === 0 && this.pageSize === 0) {
                this.selecAllArray.push({
                  userid: ele.userid,
                  ischeck: true,
                  name: ele.firstname + ' ' + ele.lastname,
                  senttype: ele.senttype,
                  companyname: ele.companyname,
                  location: cityname + statename + countryname,
                  companywebsite: ele.companywebsite,
                  img: (ele.companylogo === null) ? './assets/images/receivedimg2.png' :
                    this.cloudeURL + ele.companylogo
                });
              }
            });
          }
          console.log(this.localpage, this.currentPage);
          if (this.localpage !== null) {
            this.currentPage = this.localpage;
            this.pageSize = 10;
            if (localStorage.getItem('userPlanType') !== 'Limited Platinum' && localStorage.getItem('userPlanType') !== 'Silver') {
              if (this.selecAllArray.length > 0) {
                await this.sendreferralarray.forEach((element, index) => {
                  // console.log(this.sendreferralarray[index], '&&&&', index);
                  if (this.sendreferralarray[index]['senttype'] === 0
                    || this.sendreferralarray[index]['senttype'] === 2) {
                    // console.log(this.sendreferralarray[index], '!!!!!!!!!!!!!!!!!!!!!!!!!!!', index);
                    this.selecAllArray.map((ele) => {
                      console.log(this.sendreferralarray[index], '#################', index);
                      if (ele['senttype'] !== 1) {
                        this.selectedrefferals.push(ele);
                      }
                      if (element['userid'] === ele['userid']) {
                        this.sendreferralarray[index]['ischeck'] = true;
                      }
                    });
                  }
                });
                await this.removeDuplicates();
              }
            } else {
                await this.sendreferralarray.forEach((element, index) => {
                  // console.log(this.sendreferralarray[index], '&&&&', index);
                  if (this.sendreferralarray[index]['senttype'] === 0
                    || this.sendreferralarray[index]['senttype'] === 2) {
                    this.selectedrefferals.push(element);
                    this.removeDuplicates();
                    this.sendreferralarray[index]['ischeck'] = true;
                  }
                });
              }
          } else {
            this.currentPage = 1;
            this.pageSize = 10;
            if (localStorage.getItem('userPlanType') !== 'Limited Platinum' && localStorage.getItem('userPlanType') !== 'Silver') {
              if (this.selecAllArray.length > 0) {
                await this.sendreferralarray.forEach((element, index) => {
                  // console.log(this.sendreferralarray[index], '&&&&', index);
                  if (this.sendreferralarray[index]['senttype'] === 0
                    || this.sendreferralarray[index]['senttype'] === 2) {
                    // console.log(this.sendreferralarray[index], '!!!!!!!!!!!!!!!!!!!!!!!!!!!', index);
                    this.selecAllArray.map((ele) => {
                      if (ele['senttype'] !== 1) {
                        this.selectedrefferals.push(ele);
                      }
                      if (element['userid'] === ele['userid']) {
                        this.sendreferralarray[index]['ischeck'] = true;
                      }
                    });
                  }
                });
                console.log('%%%');
                await this.removeDuplicates();              }
            } else {
              await this.sendreferralarray.forEach((element, index) => {
                // console.log(this.sendreferralarray[index], '&&&&', index);
                if (this.sendreferralarray[index]['senttype'] === 0
                  || this.sendreferralarray[index]['senttype'] === 2) {
                  this.selectedrefferals.push(element);
                  this.sendreferralarray[index]['ischeck'] = true;
                }
              });
              await this.removeDuplicates();
            }
          }
        }
      });
    } else {
      this.currentPage = this.localpage;
      this.pageSize = 10;
      console.log('false, falsefalsefalse');
      if (localStorage.getItem('userPlanType') !== 'Limited Platinum' && localStorage.getItem('userPlanType') !== 'Silver') {
        await this.sendreferralarray.forEach((element, index) => {
          // console.log(this.sendreferralarray[index], '&&&&', index);
          if (this.sendreferralarray[index]['senttype'] === 0
            || this.sendreferralarray[index]['senttype'] === 2) {
            this.selecAllArray.map((ele) => {
              if (ele['senttype'] !== 1) {
                this.selectedrefferals.push(ele);
              }
              if (element['userid'] === ele['userid']) {
                this.sendreferralarray[index]['ischeck'] = false;
              }
            });
          }
        });
        this.selectedrefferals = [];
        this.selecAllArray = [];
        console.log(this.selectedrefferals, '!!!!!!!!!!!!!!!!!!!!!!!!!!!', );

      } else {
        await this.sendreferralarray.forEach((element, index) => {
          // console.log(this.sendreferralarray[index], '&&&&', index);
          if (this.sendreferralarray[index]['senttype'] === 0
            || this.sendreferralarray[index]['senttype'] === 2) {
            this.sendreferralarray[index]['ischeck'] = false;
          }
        });
      }
      this.selectedrefferals = [];
      this.selecAllArray = [];
    }
  }

  async selectedRefferals(value, isChecked, i) {
    console.log(value, isChecked, i);
    if (value['ischeck']) {
      this.selectedrefferals.map((val, index) => {
        if (val['userid'] === value['userid']) {
          this.selectedrefferals.splice(index, 1);
          this.sendreferralarray[i]['ischeck'] = false;
          this.sendRefButton = true;
          if (this.selecAllArray.length > 0) {
            this.selecAllArray.map((arr) => {
              if (arr['userid'] === this.sendreferralarray[i]['userid']) {
                arr['ischeck'] = false;
              }
            });
          }
          this.removeDuplicates();
          // console.log(this.sendreferralarray[i], '%%%%%', this.selectedrefferals[index]);
          // console.log('SelectedRefferals', this.selectedrefferals, this.sendreferralarray[i]['ischeck']);
        }
      });
    } else {
      this.sendreferralarray[i]['ischeck'] = true;
      this.selectedrefferals.push(this.sendreferralarray[i]);
      this.sendRefButton = false;
      if (this.selecAllArray.length > 0) {
        this.selecAllArray.map((arr) => {
          if (arr['userid'] === this.sendreferralarray[i]['userid']) {
            arr['ischeck'] = true;
          }
        });
      }
      this.removeDuplicates();
    }
  }

  removeDuplicates() {
    const arrayOfObjAfter = _.map(
      _.uniq(
        _.map(this.selectedrefferals, function (obj) {
          return JSON.stringify(obj);
        })
      ), function (obj) {
        return JSON.parse(obj);
      }
    );
    this.selectedrefferals = arrayOfObjAfter;
    console.log('SelectedRefferals', this.selectedrefferals);
  }


  sendAllMyRefferal() {
    this.sendpostObj['receiverId'] = [];
    console.log('selected Referrals', this.selectedrefferals);
    this.selectedrefferals.forEach((element) => {
      this.sendpostObj['receiverId'].push(element.userid);
    });
    this.postRefferal();
  }

  sendMyRefferal(value) {
    this.sendpostObj['receiverId'] = [];
    this.sendpostObj['receiverId'].push(value.userid);
    this.postRefferal();
  }

  postRefferal() {
    this.loading = true;
    console.log(this.sendpostObj);
    this.sendpostObj['referralreferenceno'] = localStorage.getItem('referalReferenceNo');
    let sentValue = [];
    this.refferalService.sendReferralData(this.sendpostObj).subscribe((response) => {
      console.log(response);
      if (response['status']['status'] === 200) {
        this.toastr.clear();
        sentValue = response['entity'];
        sentValue.forEach((ele) => {
          this.sendreferralarray.forEach((element, index) => {
            console.log(element.userid, ele.receiverid, '###');
            if (ele.receiverid === element.userid) {
              this.sendreferralarray[index]['ischeck'] = false;
              this.getprofilelist();
            }
          });
        });
        this.toastr.success('Successfuly Sent');
        this.loading = false;

        if (this.userPlanType === 'Gold') {
          if (this.referalUsage === 0) {
            this.toastr.clear();
            this.toastr.error(this.errorMessage);
          }
        }
      } else if (response['status']['status'] === 229) {
        this.toastr.error(response['status']['msg']);
        this.loading = false;
      } else if (response['status']['status'] === 230) {
        this.toastr.error(response['status']['msg']);
        this.loading = false;
      }
    });
  }

  viewProfile(userid) {
    console.log(userid);
    if ((localStorage.getItem('userPlanType') === 'Silver' ||
    localStorage.getItem('userPlanType') === 'Limited Platinum') && this.applyBlur) {
      console.log(`Cant view Profile`);
    } else {
      this.router.navigate(['/view-profile', userid]);
    }
  }

  navigatePage(userid, ischeck) {
    console.log(ischeck);
    if (ischeck === true) {
      return false;
    } else if (ischeck === false) {
      this.viewProfile(userid);
    }
  }

  upgradePlan() {
    console.log('upgrade');
    this.router.navigate(['/settings/billing']);
  }
}
