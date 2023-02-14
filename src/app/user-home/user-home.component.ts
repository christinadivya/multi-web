import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../service/post.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../service/language.service';
import { HttpParams } from '@angular/common/http';
import { type } from 'os';
import { RegisterService } from '../service/register.service';
import * as moment from 'moment-timezone';
import { MysubscriptionService } from '../service/mysubscription.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html'
})
export class UserHomeComponent implements OnInit {
  @ViewChild('congratulations') public congratz: TemplateRef<any>;

  congratzmodalRef: BsModalRef;
  mobileView = false;
  desktopView = true;
  welcomeMessage: any;
  popupMessage: any;
  intervalCount: any;
  intervalType: any;

  langData: any = { common: '', userHomePage: '' };

  currentDate = new Date();
  cloudeURL = environment.cloudFrontURL;
  name: any;
  userId: string;
  postName: any;
  userDatafirstname: any;
  userDatalastname: any;
  businame: any;
  postCon: any;
  currentUser: any = {
    userprofile: {
      profileimage: null
    }
  };
  bookmarkList = [];
  toppicksforyou: any;
  typeList = [];
  public loading = false;
  referalLimit: any;
  referalUsage: any;
  userPlanType: any;
  userPlanTypeName: any;
  errorMessage = 'You have done with your Referral, Please upgrade your plan';
  profileImage: string;
  totalNotificationCount: any;
  postlist: any;
  postArray: any;
  messageCount: any;

  constructor(private router: Router,
    private toastr: ToastrService,
    private postService: PostService,
    private language: LanguageService,
    private regService: RegisterService, private modalService: BsModalService,
    private mysubscription: MysubscriptionService, private generalService: GeneralService) {
  }

  openCongratzModal(congratulations: TemplateRef<any>) {
    this.congratzmodalRef = this.modalService.show(
      congratulations,
      Object.assign({}, { class: 'modal-custom  congrats-popup br-5' })
    );
  }

  closeModal() {
    localStorage.removeItem('Verifieduser');
    localStorage.removeItem('FirstTimeUser');
    this.congratzmodalRef.hide();
  }

  ngOnInit() {
    this.generalService.tabActive.next('/user-home');
    localStorage.removeItem('profileid');
    localStorage.removeItem('profileurl');
    this.userId = localStorage.getItem('UserId');
    // if (localStorage.getItem('FirstTimeUser') === 'true') {
    //   if (this.userId === localStorage.getItem('Verifieduser')) {
    //     this.openCongratzModal(this.congratz);
    //   }
    // }
    this.getmypost('');
    this.getAllMessagecount();
    this.notificationCount();
    this.getUrl();
    this.getALLData();
    this.getAllPost(0);
    this.getmySubscription();
    this.getmyprofile();
    // Calls the function  when window resized
    window.onresize = (e) => {
      this.ngAfterViewInit();
    };

    this.currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(this.currentUser);
    console.log(this.currentUser);

    this.fetchTopPicks();
    this.fetchLanguage();
    this.getBookmarks();
    this.getTypes();
  }

  getmypost(value: any) {
    this.toastr.clear();
    this.postArray = [];
    let params = new HttpParams();
    params = params.append('userid', localStorage.getItem('UserId'));
    this.postService.getMyPostForMessage(params.toString()).subscribe((postRes) => {
      if (postRes && postRes != null) {
        this.postlist = postRes['entity'];
        for (let i = 0; i < this.postlist.length; i++) {
          this.postArray.push(this.postlist[i].postid);
        }
      } else {
        this.postArray = [];
      }
    });
  }

  getAllMessagecount() {
    const data = {
      'userid': localStorage.getItem('UserId'),
      'postId': this.postArray
    };
    this.generalService.getAllMessageCount(data)
    .subscribe(res => {
      console.log(res);
      if (res && res['statusCode'] === 200) {
        this.messageCount = res['totalcount'];
        this.generalService.overAllMessageCount.next(this.messageCount);
      } else {
        this.messageCount = 0;
      }
    });
  }

  notificationCount() {
    let params = new HttpParams();
    this.userId = localStorage.getItem('UserId');
    params = params.append('id', this.userId.toString());
    this.generalService.getAllUnseenNotification(params.toString()).subscribe( res => {
      this.loading = false;
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.totalNotificationCount = res['count'];
        this.generalService.overAllNotificationCount.next(this.totalNotificationCount);
      }
    });
  }

  getmyprofile() {
    this.regService.userDetails(localStorage.getItem('UserId')).subscribe(res => {

      // Successfully Retrived
      if (res['status']['status'] === 200) {
        console.log(res['entity']['userprofile']['profileimage'], '%%%');
        if (res['entity']['userprofile']['profileimage'] !== null) {
          this.profileImage = environment.cloudFrontURL + res['entity']['userprofile']['profileimage'];
          localStorage.setItem('userProfileImage', environment.cloudFrontURL + res['entity']['userprofile']['profileimage']);
          localStorage.setItem('userProfileImageName', res['entity']['userprofile']['profileimage']);
          this.postService.image.emit('headerImage');
        } else {
          this.profileImage = './assets/images/default-user.jpg';
        }
      }
    }, err => {
      console.log(err);
    });
  }

  getmySubscription() {
    let params = new HttpParams();
    params = params.append('userId', this.userId.toString());
    this.mysubscription.getMySubscription(params).subscribe((res) => {
      console.log('Subscription log ', res);
      if (res['status']['status'] === 200) {
        if (res['entity']['plantype'] === 'Trail Platinum') {
          this.userPlanType = 'Trail Platinum';
          this.userPlanTypeName = 'Free Platinum';
          this.intervalCount = res['entity']['manageplan']['intervalcount'];
          this.intervalType = res['entity']['manageplan']['intervaltype'];
          if (localStorage.getItem('FirstTimeUser') === 'true') {
            if (this.userId === localStorage.getItem('Verifieduser')) {
            this.welcomeMessage = 'Welcome to BusinessIn 🎉 Enjoy your ';
            this.popupMessage = this.userPlanTypeName + ' access for ' + this.intervalCount + ' ' + this.intervalType + 's';
              this.openCongratzModal(this.congratz);
            }
          }
        } else {
          this.userPlanType = res['entity']['plantype'];
          this.userPlanTypeName = res['entity']['plantype'];
          // if (localStorage.getItem('FirstTimeUser') === 'true') {
          //   if (this.userId === localStorage.getItem('Verifieduser')) {
          //     this.welcomeMessage = 'Welcome to BusinessIn 🎉 Enjoy your ';
          //     this.popupMessage = this.userPlanTypeName + ' access for ' + this.intervalCount + ' ' + this.intervalType + 's';
              // this.openCongratzModal(this.congratz);
          //   }
          // }
        }
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

  getUrl() {
    console.log(localStorage.getItem('navigation'), '%%%');
    if (localStorage.getItem('navigation') === 'true') {
      const routing = localStorage.getItem('route');
      // console.log('dfjhdsjf', routing);
      if (routing) {
        this.router.navigate([routing]);
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

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.onResize(window.innerWidth);
  }

  onResize(innerWidth) {
    if (innerWidth < 1023) {
      // Mobile
      this.desktopView = false;
      this.mobileView = true;
    } else {
      // desktop
      this.desktopView = true;
      this.mobileView = false;
    }
  }

  navigatePost() {
    this.toastr.clear();
    if (localStorage.getItem('userPlanType') === 'Silver' || localStorage.getItem('userPlanType') === 'Gold') {
      this.toastr.error('To enable this feature please Upgrade your plan');
    } else {
    if (this.name === undefined) {
      this.toastr.clear();
      this.toastr.error('Post title is required');
    } else {
      // localStorage.setItem('postname', this.name);

      //  behavioral subject
      this.postService.updatedPostTitle(this.name);

      this.router.navigate(['/create-a-post']);
    }
  }
  }

  getALLData() {
    this.postService.getViewData(this.userId).subscribe((getRes) => {
      if (getRes && getRes != null) {
        this.userDatafirstname = getRes['entity']['userprofile']['firstname'];
        this.userDatalastname = getRes['entity']['userprofile']['lastname'];
        if (getRes['entity'] && getRes['entity']['accounttype']) {
          this.businame = getRes['entity']['accounttype']['accounttypeshortname'];
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  getAllPost(value) {
    this.loading = true;
    let params = new HttpParams();
    params = params.append('userid', this.userId.toString());
    this.postService.getViewPost(params.toString()).subscribe((postRes) => {
      this.postCon = postRes;
      if (postRes && postRes != null) {
        this.postName = postRes['entity'];
        console.log(this.postName);
        if (value === 1) {
          this.router.navigate(['/post-list']);
        }
      }
      this.loading = false;
    }, (error) => {
      console.log(error);
    });
  }

  fetchTopPicks() {
    const data = {
      'userId': localStorage.getItem('UserId'),
      'pageNumber': 1,
      'pageSize': 3
    };
    // const count = 3;
    // const userId = localStorage.getItem('UserId');
    this.postService.topPicks(data).subscribe(res => {

      if (res['status']['status'] === 200) {
        this.toppicksforyou = res['entity'];
        console.log(this.toppicksforyou);
      }

    }, err => {
      console.log(err);
    });
  }


  viewPost(postId) {
    if (postId) {
      // navigate to view post page
      this.postService.userIdidentify = postId.userid;
      this.postService.viewPost(postId.postid, postId.userid).subscribe((responseview) => {
        console.log(responseview);
        if (responseview['status']['status'] === 200) {
          localStorage.setItem('myPostData', JSON.stringify(responseview['entity']));
          this.router.navigate(['/view-post', postId.postid]);
        } else if (responseview['status']['status'] === 228 || responseview['status']['status'] === 227) {
          localStorage.removeItem('myPostData');
          localStorage.setItem('ReferalPost', 'true');
          this.router.navigate(['/view-post', postId.postid]);
        }
      }, err => {
        localStorage.removeItem('myPostData');
        // this.toastr.error('Sorry, the user has temporarily removed this post');
      });
    }
  }

  viewcontactPost(postId) {
    if (postId) {
      // navigate to view post page
      this.postService.contactInfo = 1;
      this.router.navigate(['/view-post', postId]);
    }

  }

  getBookmarks() {
    const size = 2;
    let params = new HttpParams();
    params = params.append('pageSize', size.toString());
    params = params.append('userid', this.userId.toString());
    this.postService.getBookmarks(params.toString()).subscribe((response: any) => {
      console.log(response);
      if (response && response['entity']) {
        this.bookmarkList = response['entity'];
      }
    });
  }

  removeBookmark(bookmark) {
    let params = new HttpParams();
    params = params.append('postid', bookmark.postid.toString());
    params = params.append('userid', this.userId.toString());
    this.postService.addBookmark(params).subscribe((response: any) => {
      console.log(response);
      if (response.status.status === 200) {
        this.toastr.clear();
        this.toastr.success('Bookmarked Post is Removed successfully');
        this.getBookmarks();
      }
    });

  }

  getTypes() {
    this.postService.typesList.subscribe((types: any) => {
      if (types) {
        this.typeList = types;
      }
    });

  }

  getTypeAcc(content) {
    const obj = {
      origin: 2,
      userId: this.userId,
      acctype: content.accounttypeid
    };
    this.regService.accountDetails_1 = obj;
    localStorage.setItem('origin', '2');
    this.router.navigate(['/search']);
  }

  convertutctolocal(value): string {
    const time = value.toString().split(' ');
    return this.setLocaldatetime(time[0], time[1]);
  }

  setLocaldatetimewithsecond(date, time) {
    let now_utc1 = '0';
    let local;
    if (date && time) {
      const now1 = new Date(date + ' ' + time);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-' +
      this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes(+':00'));
    }
    return now_utc1;
  }

  setLocaldatetime(date, time): string {
    let now_utc1 = '0';
    let local;
    if (date && time) {
      const now1 = new Date(date + ' ' + time);
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

  getReferrals() {
    this.toastr.clear();
    console.log(this.userPlanType, '$$$$');
    if (this.userPlanType !== 'Platinum' && this.userPlanType !== 'Trail Platinum') {
      if (this.referalLimit === this.referalUsage) {
        this.toastr.error(this.errorMessage);
      } else {
        this.router.navigate(['/get-referral']);
      }
    } else {
      this.router.navigate(['/get-referral']);
    }
  }
}
