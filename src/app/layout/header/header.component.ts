import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RegisterService } from '../../service/register.service';
import { LanguageService } from 'src/app/service/language.service';
import { PostService } from '../../service/post.service';
import { Location } from '@angular/common';
import { defaultDayOfMonthOrdinalParse } from 'ngx-bootstrap/chronos/locale/locale.class';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { MysubscriptionService } from '../../service/mysubscription.service';
import { GeneralService } from 'src/app/service/general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',

})
export class HeaderComponent implements OnInit {

  @Output() messageEvent: EventEmitter<any> = new EventEmitter();
  currentUserDetails: any;
  langData: any = { common: '', header: '' };
  isFilter = false;
  moreFilter = false;
  showInvertorType = false;
  search = '';
  typeList = [];
  suggestions: boolean;
  suggestedLocation: any;
  public items: any[] = this.suggestedLocation;
  industryList = [];
  seletedIndustry = [];
  seletedLocation = [];
  searchPop = false;
  accValue: any;
  inves: any;
  companysize: any;
  searchcheck = '';
  searchCheckCon = false;
  searchHomeCon = false;
  postId;
  userprofile: any;
  profileName: string;
  profileImage: string;
  companyName: any;
  applyBlur = false;
  tooltipStatus = '';
  beforeLoginHeader = false;
  afterLoginHeader = false;
  public headerProfileImage: any;
  unsub: any;
  currentPlanName: any;
  overAllMessage: any;
  totalMessage: any;
  totalNotificationCount: any;
  overAllNotification: any;
  instanceNotificationCount: any;
  currentPage = 1;
  pageSize = 10;
  userId: any;
  postlist: any;
  postArray: any;
  messageCount: any;
  subEnable = false;
  isHomeTab = true;
  isMessageTab = false;
  isBookmarkTab = false;
  isMypostTab = false;
  isNotificationTab = false;
  isReferralTab = false;
  isCreatepostTab = false;
  subTabActive: any;
  tabactive: any;

  constructor(private router: Router,
    private services: RegisterService,
    private postService: PostService,
    private language: LanguageService,
    private location: Location,
    private regService: RegisterService,
    private toastr: ToastrService,
    private mysubscription: MysubscriptionService,
    private generalService: GeneralService) {
    router.events.subscribe((val) => {
      const navEnd = val instanceof NavigationEnd;
      if (navEnd) {
        this.titleChange();
      }
    });
    const geturl = this.router.url;

    if (localStorage.getItem('currentusertoken') !== '') {
      if (geturl.includes('view-post')) {
        const params = geturl.split('view-post/');
        this.router.navigate([`/view-post/${params[1]}`]);
      }
      if (geturl.includes('view-profile')) {
        console.log(geturl);
        const params = geturl.split('view-profile/');
        this.router.navigate([`/view-profile/${params[1]}`]);
      }
    } else {
      localStorage.setItem('navigation', 'true');
      if (geturl.includes('view-post')) {
        const params = geturl.split('view-post/');
        localStorage.setItem('route', `/view-post/${params[1]}`);
      }
      if (geturl.includes('view-profile')) {
        const params = geturl.split('view-profile/');
        this.router.navigate([`/view-profile/${params[1]}`]);
        localStorage.setItem('route', `/view-post/${params[1]}`);
      }
    }
  }
  uId = localStorage.getItem('UserId');

  cloudeURL = environment.cloudFrontURL;

  titleChange() {
    const path = this.location.path().split('/');
    if (path[1] === 'search') {
      console.log(path[1]);
      this.searchPop = false;
      this.search = this.regService.accountDetails_1['search'];
      // this.searchCheckCon = true;
      // this.searchHomeCon = false;
      // this.searchcheck = this.search;
    } else {
      // localStorage.removeItem('innersearch');
      this.searchPop = false;
      this.search = '';
      // this.searchCheckCon = false;
      // this.searchHomeCon = true;
    }
  }

  settings() {
    console.log('settttt');
    this.isHomeTab = false;
    this.isMessageTab = false;
    this.isBookmarkTab = false;
    this.isMypostTab = false;
    this.isCreatepostTab = false;
    this.isNotificationTab = false;
    this.isReferralTab = false;
  }

  navigation(data) {
    if (this.subEnable === false) {
      if (data === '/user-home') {
        this.isHomeTab = true;
        this.isMessageTab = false;
        this.isBookmarkTab = false;
        this.isMypostTab = false;
        this.isCreatepostTab = false;
        this.isNotificationTab = false;
        this.isReferralTab = false;
        this.router.navigate([data]);
      }
      if (data === '/messages' || this.tabactive === '/messages') {
        this.isHomeTab = false;
        this.isMessageTab = true;
        this.isBookmarkTab = false;
        this.isMypostTab = false;
        this.isCreatepostTab = false;
        this.isNotificationTab = false;
        this.isReferralTab = false;
        this.router.navigate([data]);
      }
      if (data === '/bookmarks' || this.tabactive === '/bookmarks') {
        this.isHomeTab = false;
        this.isMessageTab = false;
        this.isBookmarkTab = true;
        this.isMypostTab = false;
        this.isCreatepostTab = false;
        this.isNotificationTab = false;
        this.isReferralTab = false;
        this.router.navigate([data]);
      }
      if (data === '/post-list' || this.tabactive === '/post-list') {
        this.isHomeTab = false;
        this.isMessageTab = false;
        this.isBookmarkTab = false;
        this.isMypostTab = true;
        this.isCreatepostTab = false;
        this.isNotificationTab = false;
        this.isReferralTab = false;
        this.router.navigate([data]);
      }
      if (data === '/create-a-post' || this.tabactive === '/create-a-post') {
        console.log(this.tabactive);
        if (!(localStorage.getItem('userPlanType') === 'Silver' || localStorage.getItem('userPlanType') === 'Gold')) {
          this.router.navigate([data]);
        }
        this.isHomeTab = false;
        this.isMessageTab = false;
        this.isBookmarkTab = false;
        this.isMypostTab = false;
        this.isCreatepostTab = true;
        this.isNotificationTab = false;
        this.isReferralTab = false;
      }
      if (data === '/notifications' || this.tabactive === '/notifications') {
        this.isHomeTab = false;
        this.isMessageTab = false;
        this.isBookmarkTab = false;
        this.isMypostTab = false;
        this.isCreatepostTab = false;
        this.isNotificationTab = true;
        this.isReferralTab = false;
        this.router.navigate([data]);
      }
      if (data === '/view-referral' || this.tabactive === '/view-referral') {
        this.isHomeTab = false;
        this.isMessageTab = false;
        this.isBookmarkTab = false;
        this.isMypostTab = false;
        this.isCreatepostTab = false;
        this.isNotificationTab = false;
        this.isReferralTab = true;
        this.router.navigate([data]);
      }
      if (data === '/search') {
        this.router.navigate([data]);
      }
    }
  }

  notificationCount() {
    setInterval(() => {
      if (localStorage.getItem('UserId') !== null) {
        let params = new HttpParams();
        this.userId = localStorage.getItem('UserId');
        params = params.append('id', this.userId);
        this.generalService.getAllUnseenNotification(params.toString()).subscribe((data: any) => {
          this.totalNotificationCount = data.count;
        });
      }
    }, 15000);
  }

  getAllMessagecount() {
    setInterval(() => {
      if (localStorage.getItem('UserId') !== null) {
        const data = {
          'userid': localStorage.getItem('UserId')
        };
        this.generalService.getAllMessageCount(data)
        .subscribe(res => {
          if (res && res['statusCode'] === 200) {
            this.totalMessage = res['totalcount'];
          } else {
            this.messageCount = 0;
          }
        });
      }
    }, 15000);
  }

  ngOnInit() {
    console.log(localStorage.getItem('UserId'));
    this.generalService.subEnable.subscribe(res => {
       this.subEnable = res;
    });
    this.generalService.tabActive.subscribe(res => {
      this.tabactive = res;
      console.log('this.tabactive', this.tabactive);
      this.navigation(this.tabactive);
    });
    if (localStorage.getItem('UserId') !== null) {
      // this.getmypost('');
      this.getAllMessagecount();
      this.notificationCount();
    }
    // behavioral object

    this.unsub = this.mysubscription.updatedPlanName.subscribe(res => {
      if (res) {
        console.log('res ', res);
        this.currentPlanName = res;
        if (this.currentPlanName === 'Silver' || this.currentPlanName === 'Gold') {
          this.applyBlur = true;
          this.tooltipStatus = 'Please Upgrade your plan to enable this feature';
        } else {
          this.applyBlur = false;
          this.tooltipStatus = '';
        }
      }
    });
    console.log(this.currentPlanName);
    this.overAllMessage = this.generalService.overAllMessageCount.subscribe(res => {
      if (res) {
        console.log(res);
        this.totalMessage = res;
        console.log(this.totalMessage);
      }
    });
    this.overAllNotification = this.generalService.overAllNotificationCount.subscribe(res => {
      if (res) {
        console.log(res);
        this.totalNotificationCount = res;
        console.log(this.totalNotificationCount);
      }
    });
    //  Fetching Loged in User Details
    if (localStorage.getItem('currentusertoken') !== '') {
      this.beforeLoginHeader = false;
      this.afterLoginHeader = true;
    } else {
      this.beforeLoginHeader = true;
      this.afterLoginHeader = false;
    }
    this.getmySubscription();
    this.fetchUserDetails(this.uId);
    this.fetchLanguage();
    this.getTypes();
    this.getAcc();
    this.postService.image.subscribe((res) => {
      if (res) {
        this.profileImage = localStorage.getItem('userProfileImage');
        this.currentUserDetails.userprofile.profileimage = localStorage.getItem('userProfileImageName');
      }
    });
  }

  getmySubscription() {
    this.generalService.getSubscriptionStatus()
      .subscribe((response: any) => {
        let params = new HttpParams();
        params = params.append('userId', localStorage.getItem('UserId').toString());
        this.mysubscription.getMySubscription(params).subscribe((res) => {
          console.log('responeeeeeeeeeeeee', res);
          if (res['status']['status'] === 200) {
            if (res['entity'] === null || res['entity'] === undefined) {
              if (response.SubscriptionEnable === true) {
                this.subEnable = true;
              }
            }
            localStorage.setItem('userPlanType', res['entity']['plantype']);
            if (res['entity']['plantype'] === 'Silver' || res['entity']['plantype'] === 'Gold') {
              this.applyBlur = true;
              this.tooltipStatus = 'Please Upgrade your plan to enable this feature';
            }
            localStorage.setItem('userPlan', JSON.stringify(res['entity']));
            localStorage.setItem('stripeId', res['entity']['stripecustomerid']);
          } else if (res['status']['status'] === 204) {
            if (res['entity'] === null || res['entity'] === undefined) {
              if (response.SubscriptionEnable === true) {
                this.subEnable = true;
              }
            }
            localStorage.setItem('userPlanType', '');
            localStorage.setItem('userPlan', null);
          }
        });
      });

  }

  getAcc() {
    this.regService.getAccType().subscribe((getvalue) => {
      this.accValue = getvalue['entity'];
    }, (error) => {
      console.log(error);
    });
  }
  getSearchPage(content) {
    this.searchPop = false;
    const obj = {
      acctype: content.accounttypeid,
      userId: this.uId,
      search: this.search,
      origin: 1
    };
    this.regService.accountDetails_1 = obj;
    localStorage.setItem('origin', '1');
    const path = this.location.path().split('/');
    if (path[1] === 'search') {
      const obj = {
        acctype: content.accounttypeid,
        userId: this.uId,
        search: this.search,
        origin: 3
      };
      this.regService.accountDetails_1 = obj;
      this.messageEvent.emit(1);
    } else {
      if (this.search !== '') {
        this.router.navigate(['/search']);
      } else {
        this.toastr.clear();
        this.toastr.error('Search field is required');
      }
    }
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

  logOut() {
    localStorage.removeItem('currentusertoken');
    localStorage.clear(); // -> to clear all
    this.router.navigate(['/home']);
    window.scrollTo(0, 0);
  }

  fetchUserDetails(userId) {
    this.services.userDetails(userId).subscribe(res => {

      // Successfully Retrived
      if (res['status']['status'] === 200) {
        localStorage.setItem('userDetails', JSON.stringify(res['entity']));
        this.currentUserDetails = res['entity'];
        console.log(res['entity']['accounttype']['accounttypeshortname']
          , '%%%%');
        this.userprofile = this.currentUserDetails.userprofile;
        this.profileName = this.userprofile.firstname + ' ' + this.userprofile.lastname;
        this.companyName = res['entity']['accounttype']['accounttypeshortname'];
        if (this.userprofile.profileimage !== null) {
          this.profileImage = environment.cloudFrontURL + this.userprofile.profileimage;
          if (localStorage.getItem('userProfileImage')) {
            this.profileImage = localStorage.getItem('userProfileImage');
          }
        } else {
          this.profileImage = './assets/images/default-user.jpg';
          if (localStorage.getItem('userProfileImage')) {
            this.profileImage = localStorage.getItem('userProfileImage');
          }
        }
        localStorage.setItem('myProfile', JSON.stringify(this.userprofile));
      }

    }, err => {
      console.log(err);
    });
  }
  onSearch(searchValue: string) {
    console.log(searchValue);
    this.searchcheck = searchValue;
    localStorage.setItem('innersearch', this.searchcheck);
  }

  onSearchChange(searchValue: string) {
    if (searchValue !== '') {
      this.searchPop = true;
    }
    this.search = searchValue.trim();
    this.isFilter = true;
  }
  focus() {
    this.searchPop = true;
  }
  focusOutFunction() {
    console.log('ssssss');
    this.searchPop = false;
  }
  // showMoreFilter() {
  //   this.moreFilter = !this.moreFilter;
  //   this.postService.getCompanySize().subscribe(res => {
  //     if (res['status']['status'] === 200) {
  //       // console.log(res);
  //       this.companysize = res['entity'];
  //     }
  //   }, err => {
  //     console.log(err);

  //   });
  // }

  clearFilter() {
    this.search = '';
  }

  getTypes() {
    this.postService.getTypeList().subscribe((types: any) => {
      if (types.status && types.status.status === 200) {
        this.typeList = types.entity;
        console.log(this.typeList);
        this.postService.typesList.next(this.typeList);
      }
    });
  }

  // mylocationSearch(value) {
  //   if (value !== '') {
  //     this.suggestions = true;
  //     this.services.searchLocations(value).subscribe((location) => {
  //       if (location && location['entity']) {
  //         this.suggestedLocation = location['entity'];
  //         console.log(location['entity']);
  //         this.items = this.suggestedLocation;
  //       }
  //     });
  //   } else {
  //     this.suggestedLocation = [];
  //     this.suggestions = false;
  //   }
  // }

  // getIndustryList() {
  //   this.services.getAllIndustry().subscribe((industry: any) => {

  //     if (industry.status && industry.status.status === 200) {
  //       this.industryList = industry.entity;
  //     }
  //   });

  // }

  // onTypeChange(type) {
  //   console.log(type);
  //   if (type) {
  //     const typeDetail = this.typeList.find((data) => data.accounttypeid === +type);
  //     console.log(typeDetail);
  //     if (typeDetail.accounttypeshortname === 'Investors') {
  //       this.showInvertorType = true;
  //       this.postService.getSubPost(typeDetail.accounttypeid).subscribe((insValue) => {
  //         this.inves = insValue['entity'];
  //       });
  //     } else {
  //       this.showInvertorType = false;
  //     }
  //   }
  // }

  // locationChanges(location) {
  //   if (location.length > 0) {
  //     const index = this.seletedLocation.findIndex((loc) => loc.cityid === location[0].data.cityid);
  //     if (index === -1) {
  //       this.seletedLocation.push(location[0].data);
  //     }
  //   }
  // }

  // removeLocation(index) {

  //   this.seletedLocation.splice(index, 1);

  // }

  // removeIndustry(index) {
  //   this.seletedIndustry.splice(index, 1);
  // }

  // onIndChange(ind) {

  //   if (ind) {
  //     const details = this.industryList.find((industry) => industry.industryid === + ind);
  //     const index = this.seletedIndustry.findIndex((industry) => industry.industryid === details.industryid);
  //     if (index === -1) {
  //       this.seletedIndustry.push(details);
  //     }
  //   }
  // }


  createPost() {
    if (this.subEnable === false) {
      this.navigation('/create-a-post');
      this.getmySubscription();
      if (localStorage.getItem('userPlanType') === 'Silver' || localStorage.getItem('userPlanType') === 'Gold') {
        this.applyBlur = true;
        this.tooltipStatus = 'Please Upgrade your plan to enable this feature';
      } else {
        this.router.navigate(['/create-a-post']);
      }
    }

  }

  profile() {
    if (this.subEnable === false) {
      this.mysubscription.profileClicked.emit('ProfileClicked');
      this.router.navigate(['/settings', 'true']);
    }
  }

  settingsTab() {
    if (this.subEnable === false) {
      this.mysubscription.settingsClicked.emit('SettingsClicked');
      this.router.navigate(['/settings', 'billing']);
    }

  }

  privacyTab() {
    this.mysubscription.settingsClicked.emit('PrivacyClicked');
    this.router.navigate(['/settings', 'privacy']);
  }

  faq() {
    if (this.subEnable === false) {
      this.router.navigate(['/faq']);
    }
  }

  buisnessPitch() {
    this.router.navigate(['/businesspitch']);
  }
}
